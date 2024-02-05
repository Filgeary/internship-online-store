import {memo} from 'react';
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import useInit from "@src/hooks/use-init";
import Navigation from "@src/containers/navigation";
import PageLayout from "@src/components/page-layout";
import Head from "@src/components/head";
// import CatalogFilter from "@src/containers/catalog-filter";
import { CatalogFilter } from '@src/containers/hoc/with-catalog-filter';
import CatalogList from "@src/containers/catalog-list";
import LocaleSelect from "@src/containers/locale-select";
import TopHead from "@src/containers/top-head";
import generateUniqueId from "@src/utils/unicque_id"
import codeGenerator from '@src/utils/code-generator';

function Main() {

  const store = useStore();

  useInit(async () => {
    store.make('catalog2', 'catalog')
    await Promise.all([
      store.actions.catalog.initParams(),
      store.actions.categories.load(),
    ]);
  }, [], true);

  const {t} = useTranslate();

  return (
    <PageLayout>
      <TopHead/>
      <Head title={t('title')}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <CatalogFilter/>
      <CatalogList stateName='catalog'/>
    </PageLayout>
  );
}

export default memo(Main);
