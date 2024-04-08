import {memo} from 'react';
import useStore from "../../hooks/use-store";
import useTranslate from "../../hooks/use-translate";
import useInit from "../../hooks/use-init";
import Navigation from "../../containers/navigation";
import PageLayout from "../../components/page-layout";
import Head from "../../components/head";
import CatalogFilter from "../../containers/catalog-filter";
import CatalogList from "../../containers/catalog-list";
import LocaleSelect from "../../containers/locale-select";
import TopHead from "../../containers/top-head";

//const CatalogList = lazy(() => import('../../containers/catalog-list'));

function Main() {

  const store = useStore();

  useInit(async () => {
  //  if(!store.preloaded)
    await Promise.all([
      store.actions.catalog.initParams(),
      store.actions.categories.load(),
      store.actions.countries.load(),
    ]);
  }, [], "catalog initial" ,true);

  const {t} = useTranslate();

  return (
    <PageLayout>
      <TopHead/>
      <Head title={t('title')}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <CatalogFilter/>
      <CatalogList/>
    </PageLayout>
  );
}

export default memo(Main);
