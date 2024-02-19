import { RefObject, useCallback, useMemo, useState } from "react";
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
  const [search, setSearch] = useState('');

  const select = useSelector((state) => ({
    countries: state.countries.list,
    count: state.countries.count,
    waiting: state.countries.waiting,
    madeIn: state.catalog.params.madeIn
  }));

  const callbacks = {
    onSearch: useCallback(
      (value: string) => {
        setSearch(value);
        store.actions.countries.search(value);
      },
      [store]
    ),
    onSelect: useCallback(
      (_id: string) => {
        store.actions.catalog.setParams({ madeIn: _id, page: 1 });
      },
      [store]
    ),
    onOpen: () => store.actions.countries.load(),
  };

  const options = {
    selected: select.countries.find(item => item._id === select.madeIn),
    countriesList: useMemo<Country[]>(() => {
      if(search) {
        return select.countries;
      }
      return [{_id: '', code: '', title: "Все"}, ...select.countries]
    }, [select.countries, search])
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
    input: (searchRef: RefObject<HTMLInputElement>) => (
      <Input
        value={""}
        name={"search-value"}
        onChange={callbacks.onSearch}
        placeholder="Поиск"
        theme="search"
        ref={searchRef}
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
