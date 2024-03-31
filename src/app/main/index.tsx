import { memo } from 'react';

import Head from '@src/components/head';
import PageLayout from '@src/components/page-layout';
import CatalogFilter from '@src/containers/catalog-filter';
import CatalogList from '@src/containers/catalog-list';
import LocaleSelect from '@src/containers/locale-select';
import Navigation from '@src/containers/navigation';
import TopHead from '@src/containers/top-head';
import useInit from '@src/hooks/use-init';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';

function Main() {
  const store = useStore();
  const { t } = useTranslate();

  useInit(
    async () => {
      if (!store.hasSlice('catalog2')) {
        store.createSlice('catalog2', 'catalog');
      }

      await Promise.all([store.actions.catalog.initParams(), store.actions.categories.load()]);
    },
    [],
    {
      ssrKey: 'main',
      backForward: true,
    },
  );

  return (
    <PageLayout>
      <TopHead />
      <Head title={t('title')}>
        <LocaleSelect />
      </Head>
      <Navigation />
      <CatalogFilter />
      <CatalogList />
    </PageLayout>
  );
}

export default memo(Main);
