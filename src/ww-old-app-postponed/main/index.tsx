import {memo} from 'react';
import useStore from "../../ww-old-hooks-postponed/use-store";
import useTranslate from "../../ww-old-hooks-postponed/use-translate";
import useInit from "../../ww-old-hooks-postponed/use-init";
import Navigation from "@src/ww-old-containers/navigation";
import PageLayout from "@src/ww-old-components-postponed/page-layout";
import Head from "@src/ww-old-components-postponed/head";
import CatalogFilter from "@src/ww-old-containers/catalog-filter";
import CatalogList from "@src/ww-old-containers/catalog-list";
import LocaleSelect from "@src/ww-old-containers/locale-select";
import TopHead from "@src/ww-old-containers/top-head";
import SelectCountriesList from "@src/ww-old-containers/select-countries-list";

function Main() {

  const store = useStore();

  useInit(async () => {
    await Promise.all([
      store.actions.catalog.initParams(),
      store.actions.categories.load(),
    ]);
  }, [], true);

  const {t} = useTranslate();

  return (
    <PageLayout>
      <TopHead/>
      <Head title={t('title.main')}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <CatalogFilter/>
      <CatalogList/>
    </PageLayout>
  );
}

export default memo(Main);
