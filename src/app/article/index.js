import ArticleCard from "@src/components/article-card";
import Head from "@src/components/head";
import PageLayout from "@src/components/page-layout";
import Spinner from "@src/components/spinner";
import LocaleSelect from "@src/containers/locale-select";
import Navigation from "@src/containers/navigation";
import TopHead from "@src/containers/top-head";
import useInit from "@src/hooks/use-init";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import articleActions from "@src/store-redux/article/actions";
import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import shallowequal from "shallowequal";

function Article() {
  const store = useStore();

  const dispatch = useDispatch();
  // Параметры из пути /articles/:id

  const params = useParams();

  useInit(() => {
    //store.actions.article.load(params.id);
    dispatch(articleActions.load(params.id));
  }, [params.id]);

  const select = useSelector(
    (state) => ({
      article: state.article.data,
      waiting: state.article.waiting,
    }),
    shallowequal
  ); // Нужно указать функцию для сравнения свойства объекта, так как хуком вернули объект

  const { t } = useTranslate();

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(
      (_id, amount) => store.actions.basket.addToBasket(_id, amount),
      [store]
    ),
  };

  const openDialogAmount = useCallback(
    (_id) => {
      store.actions.modals.open(
        "dialogAmount",
        callbacks.addToBasket.bind(null, _id)
      );
    },
    [store]
  );

  return (
    <PageLayout>
      <TopHead />
      <Head title={select.article.title}>
        <LocaleSelect />
      </Head>
      <Navigation />
      <Spinner active={select.waiting}>
        <ArticleCard article={select.article} onAdd={openDialogAmount} t={t} />
      </Spinner>
    </PageLayout>
  );
}

export default memo(Article);
