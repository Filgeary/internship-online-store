import {memo, useCallback, useEffect} from 'react';
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
import addingActions from '@src/store-redux/adding/actions';
import modalActions from '@src/store-redux/modals/actions';

function Article() {
  const store = useStore();

  const dispatch = useDispatch();
  // Параметры из пути /articles/:id

  const params = useParams();

  useInit(() => {
    //store.actions.article.load(params.id);
    dispatch(articleActions.load(params.id));
  }, [params.id]);

  const select = useSelector(state => ({
    article: state.article.data,
    waiting: state.article.waiting,
    articleId: state.adding.id,
    articleCount: state.adding.count,
    isAdding: state.adding.isAdd,
  }), shallowequal); // Нужно указать функцию для сравнения свойства объекта, так как хуком вернули объект

  const {t} = useTranslate();

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(_id => {
      dispatch(modalActions.open("addToBasket"));
      dispatch(addingActions.open(_id));
    }, [store]),
  }

  useEffect(() => {
    if(select.isAdding) {
      store.actions.basket.addToBasket(select.articleId, select.articleCount);
      dispatch(addingActions.close());
    }
  }, [select.isAdding])

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
