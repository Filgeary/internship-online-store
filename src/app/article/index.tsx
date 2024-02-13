import {memo, useCallback} from 'react';
import {useParams} from "react-router-dom";
import useStore from "../../hooks/use-store";
import useTranslate from "../../hooks/use-translate";
import useInit from "../../hooks/use-init";
import PageLayout from "../../components/page-layout";
import Head from "../../components/head";
import Navigation from "../../containers/navigation";
import Spinner from "../../components/spinner";
import ArticleCard from "../../components/article-card";
import LocaleSelect from "../../containers/locale-select";
import TopHead from "../../containers/top-head";
//import {useSelector} from 'react-redux';
import useSelector from '../../hooks/use-selector';

function Article() {
  const store = useStore();

  //const dispatch = useDispatch();
  // Параметры из пути /articles/:id

  const params = useParams();

  useInit(() => {
    store.actions.article.load(params.id);
    //dispatch(articleActions.load(params.id));
  }, [params.id]);

  const select = useSelector(state => ({
    article: state.article.data,
    waiting: state.article.waiting,
  })); // Нужно указать функцию для сравнения свойства объекта, так как хуком вернули объект

  const {t} = useTranslate();

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback((_id: string, _title: string) => {
      store.actions.modals.open("addToBasket").then( result => {
        if(result) {
          store.actions.basket.addToBasket(_id, result)
        }
      });
    }, [store]),
  }

  return (
    <PageLayout>
      <TopHead/>
      <Head title={select.article?.title}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <Spinner active={select.waiting}>
        <ArticleCard article={select.article} onAdd={callbacks.addToBasket} t={t}/>
      </Spinner>
    </PageLayout>
  );
}

export default memo(Article);
