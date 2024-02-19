import { useCallback, useMemo } from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import DropdownTemplate from "@src/components/dropdown-template";
import Spinner from "@src/components/spinner";
import Input from "@src/components/input";
import ItemCountry from "@src/components/item-country";
import CountriesList from "@src/components/countries-list";
import { Country } from "@src/store/countries/type";

function Dropdown() {
  const store = useStore();

  const select = useSelector((state) => ({
    countries: state.countries.list,
    count: state.countries.count,
    waiting: state.countries.waiting,
    madeIn: state.catalog.params.madeIn
  }));

  const callbacks = {
    onSearch: useCallback(
      (value: string) => {
        store.actions.countries.search(value);
      },
      [store]
    ),
    onSelect: useCallback(
      (data: Country) => {
        store.actions.catalog.setParams({ madeIn: data._id, page: 1 });
      },
      [store]
    ),
  };

  const options = {
    selected: select.countries.find(item => item._id === select.madeIn),
    countriesList: useMemo<Country[]>(() => [{_id: '', code: '', title: "Все"}, ...select.countries], [select.countries])
  }

  const renders = {
    selectedItem: useCallback(
      () => (
        <ItemCountry
          title={options.selected?.title ? options.selected?.title : "Все"}
          code={options.selected?.code}
        />
      ),
      [options.selected]
    ),
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
            countries={options.countriesList}
            selectedItemId={select.madeIn}
            onSelect={callbacks.onSelect}
          />
        </Spinner>
      ),
      [select.countries, select.madeIn]
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
