import { memo, useMemo } from "react";
import CmsArticle from "../cms-article";
import useInit from "../../hooks/use-init";
import useStore from "../../hooks/use-store";
import useSelector from "../../hooks/use-selector";
import Spinner from "../../components/spinner";
import { Modal, message } from "antd";
import { ArticleDTOType } from "../../store/cms-article/types";

type CMSArticleModalPropsType = {
  data?: any
  close: (value?: string) => void
}

function CMSArticleModal(props: CMSArticleModalPropsType) {

  const store = useStore();
  const select = useSelector(state =>({
    countries: state.countries.list,
    countriesLoading: state.countries.waiting,
    categories: state.categories.list,
    categoriesLoading: state.categories.waiting,
    article: state.article.data,
    articleLoading: state.article.waiting,
    submitting: state.cmsArticle.waiting,
  }))

  useInit(async () => {
    let categoryPr;
    if(!select.categories.length) {
      categoryPr = store.actions.categories.load();
    }
    let countriesPr;
    if(!select.countries.length) {
      countriesPr = store.actions.countries.load();
    }
    let articlePr;
    if(props.data) {
      articlePr = store.actions.article.load(props.data);
    }
    await Promise.all([
      categoryPr,
      countriesPr,
      articlePr,
    ])
  }, [])

  const callbacks = {
    closeModal: () => props.close(),
    createArticle: (data: ArticleDTOType) => {
      store.actions.cmsArticle.createArticle(data)
        .then(res => {
          props.close("success");
          message.success(`Товар успешно создан`)
        })
        .catch(res => message.error(`Произошла ошибка при сохранении`))
    },
    updateArticle: (data: ArticleDTOType) => {
      store.actions.cmsArticle.updateArticle(data)
        .then(res => {
          props.close("success");
          message.success(`Товар успешно изменен`)
        })
        .catch(res => message.error(`Произошла ошибка при сохранении`))
    },
  }

  const categoryOptions = useMemo(() => {
    return select.categories.map(c => {
      return {...c, label: c.title, value: c._id}
    })
  }, [select.categories])

  const countriesOptions = useMemo(() => {
    return select.countries.map(c => ({...c, label: c.title, value: c._id}))
  }, [select.countries])

  const submitCB = props.data ? callbacks.updateArticle : callbacks.createArticle

  return (
    <Modal title={props.data ? "Редактирование товара" : "Создание товара"}
           open={true} onCancel={callbacks.closeModal}
           centered
           width={800}
           footer={null}>
      <Spinner active={select.articleLoading || select.categoriesLoading || select.countriesLoading}>
        <CmsArticle article={props.data && select.article}
                    categories={categoryOptions}
                    countries={countriesOptions}
                    isSubmitting={select.submitting}
                    onSubmit={submitCB}/>
      </Spinner>
    </Modal>
  )
}

export default memo(CMSArticleModal);
