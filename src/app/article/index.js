import {memo, useCallback, useMemo} from 'react';
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
import dialogsActions from '@src/store-redux/dialogs/actions';
import addProductActions from '@src/store-redux/add-product/actions';

function Article() {
  const store = useStore();

  const dispatch = useDispatch();
  // Параметры из пути /articles/:id

  const params = useParams();

  useInit(async () => {
    //store.actions.article.load(params.id);
    dispatch(articleActions.load(params.id));
  }, [params.id]);

  const select = useSelector(state => ({
    article: state.article.data,
    waiting: state.article.waiting,
    addProductWaiting: state.addProduct.waiting,
  }), shallowequal); // Нужно указать функцию для сравнения свойства объекта, так как хуком вернули объект

  const {t} = useTranslate();

  const callbacks = {
    // Открытие диалогового окна для добавления в корзину
    addToBasketDialog: useCallback(_id => {
      dispatch(dialogsActions.open('add-to-basket'));       // Открываем диалоговое окно
      dispatch(addProductActions.setData(select.article)); // Отправляем ему данные
    }, [store, select.article]),
  }

  return (
    <PageLayout>
      <TopHead/>
      <Head title={select.article.title}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <Spinner active={select.waiting}>
        <ArticleCard article={select.article}
          onAdd={callbacks.addToBasketDialog}
          isDialogOpen={select.addProductWaiting}
          t={t}
        />
      </Spinner>
    </PageLayout>
  );
}

export default memo(Article);
