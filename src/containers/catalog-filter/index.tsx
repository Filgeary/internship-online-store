import { memo, useCallback, useMemo } from "react";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Select from "@src/components/select";
import Input from "@src/components/input";
import SideLayout from "@src/components/side-layout";
import treeToList from "@src/utils/tree-to-list";
import listToTree from "@src/utils/list-to-tree";
import Dropdown from "../dropdown";
import { StoreNames } from "./type";
import { Country } from "@src/store/countries/type";

function CatalogFilter(props: StoreNames) {
  const store = useStore();

  const select = useSelector((state) => ({
    sort: state[props.storeName]!.params.sort,
    query: state[props.storeName]!.params.query,
    category: state[props.storeName]!.params.category,
    madeIn: state[props.storeName]!.params.madeIn,
    categories: state.categories.list,
    countries: state.countries.list,
  }));

  const callbacks = {
    // Сортировка
    onSort: useCallback(
      (sort: string) => store.actions[props.storeName]!.setParams({ sort }),
      [store]
    ),
    // Поиск
    onSearch: useCallback(
      (query: string) =>
        store.actions[props.storeName]!.setParams({ query, page: 1 }),
      [store]
    ),
    // Сброс
    onReset: useCallback(
      () => store.actions[props.storeName]!.resetParams(),
      [store]
    ),
    // Фильтр по категории
    onCategory: useCallback(
      (category: string) =>
        store.actions[props.storeName]!.setParams({ category, page: 1 }),
      [store]
    ),
    onCountry: useCallback(
      (ids: string[]) => {
        store.actions[props.storeName]!.setParams({ madeIn: ids.join("|"), page: 1 });
      },
      [store]
    ),
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
          (item: { _id: string; title: string }, level: number) => ({
            value: item._id,
            title: "- ".repeat(level) + item.title,
          })
        ),
      ],
      [select.categories]
    ),
    countries: useMemo<Country[]>(
      () => [{ _id: "", code: "", title: "Все" }, ...select.countries],
      [select.countries]
    ),
  };

  const { t } = useTranslate();

  return (
    <SideLayout padding="medium" side="top" minHeight={55}>
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
        name={""}
      />
      <Dropdown options={options.countries} value={select.madeIn} onChange={callbacks.onCountry} />
      <button onClick={callbacks.onReset}>{t("filter.reset")}</button>
    </SideLayout>
  );
}

export default memo(CatalogFilter);
