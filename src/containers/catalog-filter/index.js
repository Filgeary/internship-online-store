import Input from "@src/components/input";
import Select from "@src/components/select";
import SideLayout from "@src/components/side-layout";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import listToTree from "@src/utils/list-to-tree";
import treeToList from "@src/utils/tree-to-list";
import { memo, useCallback, useMemo } from "react";

function CatalogFilter({ catalogSliceName = "catalog" }) {
  const store = useStore();
  const { t } = useTranslate();

  const select = useSelector((state) => ({
    sort: state[catalogSliceName].params.sort,
    query: state[catalogSliceName].params.query,
    category: state[catalogSliceName].params.category,
    categories: state.categories.list,
  }));

  const callbacks = {
    // Сортировка
    onSort: useCallback(
      (sort) => store.actions[catalogSliceName].setParams({ sort }),
      [store]
    ),
    // Поиск
    onSearch: useCallback(
      (query) => store.actions[catalogSliceName].setParams({ query, page: 1 }),
      [store]
    ),
    // Сброс
    onReset: useCallback(
      () => store.actions[catalogSliceName].resetParams(),
      [store]
    ),
    // Фильтр по категории
    onCategory: useCallback(
      (category) =>
        store.actions[catalogSliceName].setParams({ category, page: 1 }),
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
        ...treeToList(listToTree(select.categories), (item, level) => ({
          value: item._id,
          title: "- ".repeat(level) + item.title,
        })),
      ],
      [select.categories]
    ),
  };

  return (
    <SideLayout padding="medium">
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

export default memo(CatalogFilter);
