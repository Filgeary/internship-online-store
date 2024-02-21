import { memo, useCallback, useMemo } from "react";
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
import useSelector from "@src/hooks/use-selector";
import SelectCustom from "@src/components/select-custom";

function Main() {
  const store = useStore();

  useInit(
    async () => {
      store.make("catalog2", "catalog");
      await Promise.all([
        store.actions.catalog.initParams(),
        store.actions.categories.load(),
      ]);
    },
    [],
    true
  );

  const { t } = useTranslate();

  const select = useSelector((state) => ({
    madeIn: state.catalog.params.madeIn,

    countries: state.countries.list,
  }));

  const callbacks = {
    onMadeIn: useCallback(
      (countryId) =>
        store.actions.catalog.setParams({ madeIn: countryId }, false, true),
      [store]
    ),
  };

  const options = {
    countries: useMemo(() => {
      return [
        { value: "", title: "Все", shortcut: "" },
        ...select.countries.map((el) => {
          return { title: el.title, value: el._id, shortcut: el.code };
        }),
      ];
    }, [select.countries]),
  };

  return (
    <PageLayout>
      <TopHead />
      <Head title={t("title")}>
        <LocaleSelect />
      </Head>
      <Navigation />
      <CatalogFilter catalog="catalog" />
      <CatalogList />
      <SelectCustom
        options={options.countries}
        selected={select.madeIn}
        onChange={callbacks.onMadeIn}
        enableSearch
      />
    </PageLayout>
  );
}

export default memo(Main);
