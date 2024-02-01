import {memo, useCallback} from 'react';
import {useParams} from "react-router-dom";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import useInit from "@src/hooks/use-init";
import PageLayout from "@src/components/page-layout";
import Head from "@src/components/head";
import Navigation from "@src/containers/navigation";
import Spinner from "@src/components/spinner";
import ArticleCard from "@src/components/article-card";
import LocaleSelect from "@src/containers/locale-select";
import TopHead from "@src/containers/top-head";
import {useDispatch, useSelector} from 'react-redux';
import shallowequal from "shallowequal";
import articleActions from '@src/store-redux/article/actions';
import useModal from '@src/hooks/use-modal';

function Article() {
  const store = useStore();
  const modal = useModal()

  const dispatch = useDispatch();
  // Параметры из пути /articles/:id

  const params = useParams();

  useInit(() => {
    dispatch(articleActions.load(params.id));
  }, [params.id]);

  const select = useSelector(state => ({
    article: state.article.data,
    waiting: state.article.waiting,
  }), shallowequal); // Нужно указать функцию для сравнения свойства объекта, так как хуком вернули объект

  const {t} = useTranslate();

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback((_id, itemTitle) => new Promise((res) => modal.open({
      type: modal.types.amount,
      resolve: res,
      extraData: {
        title: 'Количество товара ' + itemTitle
      }
    })).then(amount => {
      if (amount) {
        store.actions.basket.addToBasket(_id, amount)
      }
    })
    , [store, modal]),
  }

  return (
    <PageLayout>
      <TopHead/>
      <Head title={select.article.title}>
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
