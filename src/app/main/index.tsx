import {memo} from 'react';
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import useInit from "@src/hooks/use-init";
import Navigation from "@src/containers/navigation";
import PageLayout from "@src/components/page-layout";
import Head from "@src/components/head";
import CatalogFilter from "@src/containers/catalog-filter";
import CatalogList from "@src/containers/catalog-list";
import LocaleSelect from "@src/containers/locale-select";
import TopHead from "@src/containers/top-head";
import MadeInAutocomplete from '@src/components/made-in-autocomplete';

function Main() {

  const store = useStore();
  const {t, lang} = useTranslate();

  useInit(async () => {
    await Promise.all([
      store.actions.catalog.initParams(),
      store.actions.categories.load(),
      store.actions.manufacturer.load(),
    ]);
  }, [lang], true);

  return (
    <>
      <PageLayout>
        <TopHead/>
        <Head title={t("title")}>
          <LocaleSelect/>
        </Head>
        <Navigation/>
        <CatalogFilter/>
        <CatalogList/>
      </PageLayout>
      <MadeInAutocomplete
        onSelect={() => {}}
        options={[
          {
            code: '1',
            title: "First",
            value: "first"
          },
          {
            code: '2',
            title: "2",
            value: "2"
          },
          {
            code: '3',
            title: "3",
            value: "3"
          },
          {
            code: '4',
            title: "4",
            value: "4"
          },
          {
            code: '5',
            title: "5",
            value: "5"
          },
          {
            code: '6',
            title: "6",
            value: "6"
          },
          {
            code: '7',
            title: "7",
            value: "7"
          },
          {
            code: '8',
            title: "8",
            value: "8"
          },
          {
            code: '9',
            title: "8",
            value: "8"
          }
        ]}
        value={{
          code: '1',
          title: "First",
          value: "first"
        }}
      />
    </>
  );
}

export default memo(Main);
