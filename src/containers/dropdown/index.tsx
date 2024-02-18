import { useCallback } from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import DropdownTemplate from "@src/components/dropdown-template";
import Spinner from "@src/components/spinner";
import Input from "@src/components/input";
import ItemCountry from "@src/components/item-country";
import CountriesList from "@src/components/countries-list";

function Dropdown() {
  const store = useStore();

  const select = useSelector((state) => ({
    countries: state.countries.list,
    count: state.countries.count,
    waiting: state.countries.waiting,
    selected: state.countries.selected,
  }));

  const callbacks = {
    onSearch: useCallback(
      (value: string) => {
        store.actions.countries.search(value);
      },
      [store]
    ),
    onSelect: useCallback(
      (_id: string) => {
        store.actions.countries.select(_id);
        store.actions.catalog.setParams({ madeIn: _id, page: 1 });
      },
      [store]
    ),
  };

  const renders = {
    selectedItem: useCallback(() => (
      <ItemCountry
        title={select.selected?.title ? select.selected?.title : "Все"}
        code={select.selected?.code}
      />
    ), [select.selected]),
    input: () => (
      <Input
        value={""}
        name={"search-value"}
        onChange={callbacks.onSearch}
        placeholder="Поиск"
        theme="search"
      />
    ),
    options: useCallback(
      () => (
        <Spinner active={select.waiting}>
          <CountriesList
            countries={select.countries}
            selectedItemId={select.selected?._id}
            onSelect={callbacks.onSelect}
          />
        </Spinner>
      ),
      [select.countries, select.selected]
    ),
  };

  return (
    <DropdownTemplate
      renderSelectedItem={renders.selectedItem}
      renderInput={renders.input}
      renderOptions={renders.options}
    />
  );
}

export default Dropdown;
