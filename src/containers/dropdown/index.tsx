import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
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
    selected: state.countries.selected,
    waiting: state.countries.waiting,
    madeIn: state.catalog.params.madeIn
  }));

  useEffect(() => {
    if (Array.isArray(select.madeIn)) {
      store.actions.countries.loadById(select.madeIn);
    } else {
      store.actions.countries.loadById([select.madeIn]);
    }
  }, [select.madeIn])

  const callbacks = {
    onSearch: useCallback(
      (value: string) => {
        setSearch(value);
        store.actions.countries.search(value);
      },
      [store]
    ),
    onSelectMany: useCallback((ids: string[]) => {
        store.actions.catalog.setParams({ madeIn: ids.join('|'), page: 1 })
    }, [store]),
    removeSelectedItem: () => {

    }
  };

  const options = {
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
        <>
          {select.selected.length > 1 ? (
            select.selected.map((country) => (
              <li key={country.code} title={country.title} onClick={callbacks.removeSelectedItem}>
                <ItemCountry code={country.code} />
              </li>
            ))
          ) : (
            <ItemCountry
              code={select.selected[0]?.code}
              title={select.selected[0]?.title ?? "Все"}
            />
          )}
        </>
      ),
      [select.selected]
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
      (focusInd: number) => (
        <Spinner active={select.waiting}>
          <CountriesList
            focusInd={focusInd}
            countries={options.countriesList}
            selectedItemId={select.madeIn}
            onSelect={callbacks.onSelectMany}
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
      countOfOptions={options.countriesList.length} />
  );
}

export default Dropdown;
