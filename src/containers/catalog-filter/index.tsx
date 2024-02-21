import { memo, useCallback, useMemo, useState } from "react";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Select from "@src/components/select";
import Input from "@src/components/input";
import SideLayout from "@src/components/side-layout";
import treeToList from "@src/utils/tree-to-list";
import listToTree from "@src/utils/list-to-tree";
import SelectCustom from "@src/components/select-custom";
import MultiSelect from "@src/components/multiselect";
import { Option } from "@src/components/multiselect/types";

type CatalogFilterProps = {
  catalog: "catalog" | "catalog2";
};

function CatalogFilter({ catalog }: CatalogFilterProps) {
  const store = useStore();

  const select = useSelector((state) => ({
    sort: state[catalog].params.sort,
    query: state[catalog].params.query,
    category: state[catalog].params.category,
    madeIn: state[catalog].params.madeIn,
    categories: state.categories.list,
    countries: state.countries.list,
  }));

  const callbacks = {
    onMadeIn: useCallback(
      (countryId) =>
        store.actions[catalog].setParams(
          { madeIn: countryId },
          false,
          catalog === "catalog" ? true : false
        ),
      [store]
    ),
    // Сортировка
    onSort: useCallback(
      (sort) =>
        store.actions[catalog].setParams(
          { sort },
          false,
          catalog === "catalog" ? true : false
        ),
      [store]
    ),
    // Поиск
    onSearch: useCallback(
      (query) =>
        store.actions[catalog].setParams(
          { query, page: 1 },
          false,
          catalog === "catalog" ? true : false
        ),
      [store]
    ),
    // Сброс
    onReset: useCallback(() => store.actions[catalog].resetParams(), [store]),
    // Фильтр по категории
    onCategory: useCallback(
      (category) =>
        store.actions[catalog].setParams(
          { category, page: 1 },
          false,
          catalog === "catalog" ? true : false
        ),
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
    countries: useMemo(() => {
      return [
        { value: "", title: "Все", shortcut: "" },
        ...select.countries.map((el) => {
          return { title: el.title, value: el._id, shortcut: el.code };
        }),
      ];
    }, [select.countries]),
  };

  const { t } = useTranslate();

  const [selectedCountries, setSelectedCountries] = useState<Option[]>([
    { value: "", title: "Все", shortcut: "" },
  ]);

  const onChangeSelectedCountries = (option: Option) => {
    if (option.value === "") {
      setSelectedCountries([{ value: "", title: "Все", shortcut: "" }]);
      return;
    }
    setSelectedCountries((state) => {
      return state.filter((el) => {
        return el.value !== "";
      });
    });
    if (
      selectedCountries.some(
        (selectedCountry) => selectedCountry.value === option.value
      )
    ) {
      const filteredArray = selectedCountries.filter((el) => {
        return el.value !== option.value;
      });
      filteredArray.length
        ? setSelectedCountries(filteredArray)
        : setSelectedCountries([{ value: "", title: "Все", shortcut: "" }]);
      return;
    }
    setSelectedCountries((selectedCountries) => [...selectedCountries, option]);
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
      <SelectCustom
        options={options.countries}
        selected={select.madeIn}
        onChange={callbacks.onMadeIn}
        enableSearch
      />
      <MultiSelect
        options={options.countries}
        selected={selectedCountries}
        onChange={onChangeSelectedCountries}
        enableSearch
      />
      {/* @ts-ignore */}
      {/* <Input
        value={select.query}
        onChange={callbacks.onSearch}
        placeholder={"Поиск"}
        delay={1000}
      /> */}
      <button onClick={callbacks.onReset}>{t("filter.reset")}</button>
    </SideLayout>
  );
}

export default memo(CatalogFilter);
