import { memo, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import ArticleCard from '@src/components/article-card';
import Head from '@src/components/head';
import PageLayout from '@src/components/page-layout';
import Spinner from '@src/components/spinner';
import LocaleSelect from '@src/containers/locale-select';
import Navigation from '@src/containers/navigation';
import TopHead from '@src/containers/top-head';
import useInit from '@src/hooks/use-init';
import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';

function Article() {
  const store = useStore();
  const { t } = useTranslate();
  const { id } = useParams();

  useInit(() => {
    if (!id) return;
    store.actions.article.load(id);
  }, [id]);

  const select = useSelector(state => ({
    article: state.article.data,
    waiting: state.article.waiting,
  }));

  const callbacks = {
    addToBasket: useCallback(
      (_id: string, amount: number) => store.actions.basket.addToBasket(_id, amount),
      [store],
    ),
  };

  const openDialogAmount = useCallback(
    (_id: string) => {
      store.actions.modals.open('dialogAmount', callbacks.addToBasket.bind(null, _id));
    },
    [store],
  );

  return (
    <PageLayout>
      <TopHead />
      <Head title={select.article?.title}>
        <LocaleSelect />
      </Head>
      <Navigation />
      <Spinner active={select.waiting}>
        <ArticleCard
          article={select.article}
          onAdd={openDialogAmount}
          t={t}
        />
      </Spinner>
    </PageLayout>
  );
}

export default memo(Article);
