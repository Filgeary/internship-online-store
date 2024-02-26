import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import DropdownTemplate from "@src/components/dropdown-template";
import Spinner from "@src/components/spinner";
import Input from "@src/components/input";
import CountriesList from "@src/components/countries-list";
import DropdownSelected from "@src/components/dropdown-selected";
import { Country } from "@src/store/countries/type";
import { getPathArr } from "@src/utils/get-path-arr";
import { DropdownType } from "./type";

function Dropdown(props: DropdownType) {
  const store = useStore();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Country[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  const select = useSelector((state) => ({
    waiting: state.countries.waiting,
  }));

  useEffect(() => {
    setCountries(props.options);
  }, [props.options]);

  useEffect(() => {
    const ids = getPathArr(props.value);
    const countries = props.options.filter((item) => ids.includes(item._id));
    setSelected(countries);
  }, [props.value, props.options]);

  const callbacks = {
    onSearch: useCallback(
      (
        value: string,
        setFocusInd: React.Dispatch<React.SetStateAction<number>>
      ) => {
        setSearch(value);
        setFocusInd(-1);
        const filteredCountries = props.options.filter(
          (item) =>
            item.code.toLowerCase().includes(value.toLowerCase()) ||
            item.title.toLowerCase().includes(value.toLowerCase())
        );
        setCountries(filteredCountries);
      },
      [store, countries]
    ),
    removeSelectedItem: useCallback(
      (_id: string, e: React.MouseEvent<HTMLDivElement>) => {
        const madeIn = props.value.split("|").filter((item) => item !== _id);
        props.onChange(madeIn);
        const filterSelected = selected.filter((item) => item._id != _id);
        setSelected(filterSelected);
        e.stopPropagation();
      },
      [store, props.value]
    ),
  };

  const renders = {
    selectedItem: useCallback(
      (open: boolean) => (
        <DropdownSelected
          open={open}
          selected={selected}
          removeSelectedItem={callbacks.removeSelectedItem}
        />
      ),
      [selected]
    ),
    input: (
      searchRef: RefObject<HTMLInputElement>,
      setFocusInd: React.Dispatch<React.SetStateAction<number>>
    ) => (
      <Input
        value={search}
        name={"search-value"}
        onChange={(value) => callbacks.onSearch(value, setFocusInd)}
        placeholder="Поиск"
        theme="search"
        ref={searchRef}
      />
    ),
    options: useCallback(
      (focusInd: number, menuRef: RefObject<HTMLUListElement>) => (
        <Spinner active={select.waiting}>
          <CountriesList
            focusInd={focusInd}
            countries={countries}
            onSelect={props.onChange}
            selected={getPathArr(props.value)}
            ref={menuRef}
          />
        </Spinner>
      ),
      [countries, props.value]
    ),
  };

  return (
    <DropdownTemplate
      renderSelectedItem={renders.selectedItem}
      renderInput={renders.input}
      renderOptions={renders.options}
      countOfOptions={countries.length} />
  );
}

export default Dropdown;
