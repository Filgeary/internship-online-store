import { CountryOption } from "@src/components/country-option";
import SelectCustom from "@src/components/select-custom";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import { StoreModuleNameTemplate } from "@src/store/types";
import { memo, useCallback, useMemo } from "react";

interface ICountriesFilterProps {
  stateName: StoreModuleNameTemplate<"catalog">;
}

type TCountryOption = {
  value: string;
  code: string;
  title: string;
};

export function CountriesFilter({ stateName }: ICountriesFilterProps) {
  const store = useStore();

  const select = useSelector((state) => ({
    countries: state.countries.list,
    waiting: state.countries.waiting,
    madeIn: state[stateName].params?.madeIn
  }));

  const callbacks = {
    // onSearch: useCallback((text: string): TCountryOption[] => {
    //     return select.countries.map(country => country.title == text);
    // }, [store]),
    onSelected: useCallback((countries: TCountryOption[]) => {
      store.actions[stateName].setParams({madeIn: countries.map(item => item.value).join("|")})
    }, [store]),
    onSelectedSingle: useCallback((country: TCountryOption) => {
      store.actions[stateName].setParams({madeIn: country.value})
    }, [store]),
  };

  const options = {
    countries: useMemo<TCountryOption[]>(
      () => [
        ...select.countries.map((item) => ({
          value: item._id,
          code: item.code,
          title: item.title,
        })),
      ],
      [select.countries]
    ),
    value: useMemo<TCountryOption[]>(() => {
      if (!select.madeIn) {
        return [];
      }
      const madeInIds = select.madeIn.split("|");
      const values = select.countries.filter(country => madeInIds.includes(country._id)).map((item) => ({
        value: item._id,
        code: item.code,
        title: item.title,
      }));
      return values;
    }, [select.madeIn, select.countries])
  };

  const renders = {
    option: useCallback(
      (item: TCountryOption & { isSelected?: boolean; isHover?: boolean }) => (
        <CountryOption
          code={item.code}
          isHovered={item.isHover}
          isSelected={item.isSelected}
          title={item.title}
        />
      ),
      []
    ),
    selectedOption: useCallback(
      (item: TCountryOption) => <CountryOption code={item.code} />,
      []
    ),
  };

  return (
    <>
      <SelectCustom
        multiple={true}
        defaultValue={{ value: "", code: "", title: "Все" }}
        value={options.value}
        renderOption={renders.option}
        renderSelectedOption={renders.selectedOption}
        options={options.countries}
        onSelect={callbacks.onSelected}
      />
      {/* <SelectCustom
        multiple={false}
        defaultValue={{ value: "", code: "", title: "Все" }}
        value={options.value[0]}
        renderOption={renders.option}
        renderSelectedOption={renders.selectedOption}
        options={options.countries}
        onSelect={callbacks.onSelectedSingle}
      /> */}
      {/* <SelectCustom /> */}
    </>
  );
}

export default memo(CountriesFilter);
