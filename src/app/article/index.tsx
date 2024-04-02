import {useCallback} from 'react';
import {useParams} from "react-router-dom";
import useStore from "@src/hooks/use-store";
import useSelector from '@src/hooks/use-selector';
import useTranslate from "@src/hooks/use-translate";
import useInit from "@src/hooks/use-init";
import PageLayout from "@src/components/page-layout";
import Head from "@src/components/head";
import Navigation from "@src/containers/navigation";
import Spinner from "@src/components/spinner";
import ArticleCard from "@src/components/article-card";
import LocaleSelect from "@src/containers/locale-select";
import TopHead from "@src/containers/top-head";

function Article() {
  const store = useStore();

  // Параметры из пути /articles/:id

  const params = useParams();

  useInit(async () => {
    await store.actions.article.load(params.id!);
  }, [params.id], {ssrKey: "article.init"});

  const select = useSelector((state) => ({
    article: state.article.data,
    waiting: state.article.waiting,
  })); // Нужно указать функцию для сравнения свойства объекта, так как хуком вернули объект

  const { t } = useTranslate();

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(async (_id: string) => {
        const storeName = "count";
        store.actions.modals
          .open(storeName)
          .then((count) => store.actions.basket.addToBasket(_id, count as number));
    }, [store]),
  };

  return (
    <PageLayout>
      <TopHead/>
      <Head title={select.article.title}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <Spinner active={select.waiting}>
        <ArticleCard article={select.article} onAdd={callbacks.addToBasket} labelAdd={t("article.add")}/>
      </Spinner>
    </PageLayout>
  );
}

export default Article;
