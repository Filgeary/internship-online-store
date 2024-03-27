import { memo, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';
import useInit from '@src/hooks/use-init';
import { useAppSelector } from '@src/hooks/use-selector';

import PageLayout from '@src/components/page-layout';
import Head from '@src/components/head';
import Spinner from '@src/components/spinner';
import ArticleCard from '@src/components/article-card';

import Navigation from '@src/containers/navigation';
import LocaleSelect from '@src/containers/locale-select';
import TopHead from '@src/containers/top-head';

function Article() {
  const store = useStore();

  // Параметры из пути /articles/:id
  const params = useParams();

  useInit(() => {
    // Будем запрашивать товар только если его нету
    if (!Object.keys(store.getState().article.data).length) {
      store.actions.article.load(params.id);
    }
  }, [params.id]);

  const select = useAppSelector((state) => ({
    article: state.article.data,
    waiting: state.article.waiting,
  }));

  const { t } = useTranslate();

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(
      (_id: string | number) => store.actions.basket.addToBasket(_id),
      [store]
    ),
  };

  const isReady = (article: object): article is TArticle => {
    return (article as TArticle).title !== 'undefined';
  };

  if (!isReady(select.article)) {
    return (
      <PageLayout>
        <TopHead />
        <Head title={'Загрузка товара...'}>
          <LocaleSelect />
        </Head>
        <Navigation />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <TopHead />
      <Head title={select.article.title}>
        <LocaleSelect />
      </Head>
      <Navigation />
      <Spinner active={select.waiting}>
        <ArticleCard article={select.article} onAdd={callbacks.addToBasket} t={t} />
      </Spinner>
    </PageLayout>
  );
}

export default memo(Article);
