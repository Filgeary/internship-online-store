import { memo, useCallback, useMemo, useState } from "react";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Select from "@src/components/select";
import Input from "@src/components/input";
import SideLayout from "@src/components/side-layout";
import treeToList from "@src/utils/tree-to-list";
import listToTree from "@src/utils/list-to-tree";
import { TCountries } from "@src/store/countries";
import SelectCustom from "@src/components/select-custom";


export type TCatalogFilter = {
  storeName: "catalog";
};

function CatalogFilter(props: TCatalogFilter) {
  const store = useStore();
  const [search, setSearch] = useState<string>();

  const select = useSelector((state) => ({
    sort: state[props.storeName].params.sort,
    query: state[props.storeName].params.query,
    category: state[props.storeName].params.category,
    madeIn: state[props.storeName].params.madeIn,
    categories: state.categories.list,
    countries: state.countries.list,
    selected: state.countries.selected,
    waiting: state.countries.waiting,
  }));

  const callbacks = {
    // Сортировка
    onSort: useCallback(
      (sort: string) => store.actions[props.storeName].setParams({ sort }),
      [store]
    ),
    // Поиск
    onSearch: useCallback(
      (query: string) =>
        store.actions[props.storeName].setParams({ query, page: 1 }),
      [store]
    ),
    // Сброс
    onReset: useCallback(() => {
      store.actions[props.storeName].resetParams();
      callbacks.onResetSelectCountry();
    }, [store]),
    // Фильтр по категории
    onCategory: useCallback(
      (category: string) =>
        store.actions[props.storeName].setParams({ category, page: 1 }),
      [store]
    ),
    onMadeIn: useCallback(
      (id: string[]) =>
        store.actions[props.storeName].setParams({
          madeIn: id.join("|"),
          page: 1,
        }),
      [store]
    ),

    onSearchCountry: useCallback(
      (value: string) => {
        setSearch(value);
        store.actions.countries.search(value);
      },
      [store]
    ),
    onLoadCounties: useCallback(() => {
      store.actions.countries.loadSkip();
    }, [store]),

    onSelectCountry: useCallback(
      (item: TCountries) => {
        store.actions.countries.selectCountry(item);
      },
      [store]
    ),
    onResetSelectCountry: useCallback(() => {
      store.actions.countries.load();
    }, [store]),
  };

  const options = {
    sort: useMemo(
      () => [
        { value: "order", title: "По порядку" },
        { value: "title.ru", title: "По именованию" },
        { value: "-price", title: "Сначала дорогие" },
        { value: "edition", title: "Древние" },
      ],
      []
    ),
    categories: useMemo(
      () => [
        { value: "", title: "Все" },
        ...treeToList(
          listToTree(select.categories),
          (item: any, level: number) => ({
            value: item._id,
            title: "- ".repeat(level) + item.title,
          })
        ),
      ],
      [select.categories]
    ),

    countries: useMemo<TCountries[]>(() => {
      if (search) {
        return select.countries;
      }
      return [
        { _id: "", code: "", title: "Все", _key: "" },
        ...select.countries,
      ];
    }, [select.countries, search]),
  };

  const { t } = useTranslate();

  return (
    <SideLayout padding="medium">
      <SelectCustom
        options={options.countries}
        selected={select.selected}
        onSelect={callbacks.onMadeIn}
        onSearch={callbacks.onSearchCountry}
        waiting={select.waiting}
        onLoad={callbacks.onLoadCounties}
        onSelectCountry={callbacks.onSelectCountry}
        onReset={callbacks.onResetSelectCountry}
      />
      <Select
        options={options.categories}
        value={select.category}
        onChange={callbacks.onCategory}
      />
      <Select
        options={options.sort}
        value={select.sort}
        onChange={callbacks.onSort}
      />
      <Input
        value={select.query}
        onChange={callbacks.onSearch}
        placeholder={"Поиск"}
        delay={1000}
      />
      <button onClick={callbacks.onReset}>{t("filter.reset")}</button>
    </SideLayout>
  );
}

CatalogFilter.defaultProps = {
  storeName: "catalog",
};

export default memo(CatalogFilter);
