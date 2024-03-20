import React, {memo} from 'react';
import useStore from "@src/shared/hooks/use-store";
import useInit from "@src/shared/hooks/use-init";
import useTranslate from "@src/shared/hooks/use-translate";
import TopHead from "@src/feature/top-head";
import PageLayout from "@src/shared/ui/layout/page-layout";
import Head from "@src/shared/ui/layout/head";
import LocaleSelect from "@src/feature/locale-select";
import Navigation from "@src/feature/navigation";
import CatalogFilter from "@src/pages/main/components/catalog-filter";
import CatalogList from "@src/pages/main/components/catalog-list";

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
