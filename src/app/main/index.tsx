import { memo } from 'react';

import useTranslate from '@src/hooks/use-translate';
import Navigation from '@src/containers/navigation';
import PageLayout from '@src/components/page-layout';
import Head from '@src/components/head';
import CatalogFilter from '@src/containers/catalog-filter';
import CatalogList from '@src/containers/catalog-list';
import LocaleSelect from '@src/containers/locale-select';
import TopHead from '@src/containers/top-head';
import Catalog from '@src/containers/catalog';
import useStore from '@src/hooks/use-store';
import useInit from '@src/hooks/use-init';

function Main() {
  const store = useStore();
  const { t } = useTranslate();

  const options = {
    stateName: 'catalog',
  };

  useInit(async () => {
    // store.make('separateCatalog', 'catalog');

    await Promise.all([
      // store.actions.separateCatalog.initParams(),
      store.actions.catalog.initParams(),
      store.actions.categories.load(),
    ]);
  });

  return (
    <PageLayout>
      <TopHead />
      <Head title={t('title')}>
        <LocaleSelect />
      </Head>
      <Navigation />

      <Catalog stateName={options.stateName as 'catalog'}>
        <CatalogFilter />
        <CatalogList />
      </Catalog>
    </PageLayout>
  );
}

export default memo(Main);
