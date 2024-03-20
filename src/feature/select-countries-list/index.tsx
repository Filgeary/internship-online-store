import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ExtendedModulesKey} from "@src/shared/store/types";
import useStore from "@src/shared/hooks/use-store";
import useSelector from "@src/shared/hooks/use-selector";
import useInit from "@src/shared/hooks/use-init";
import filterOptionByName from "@src/shared/utils/filter-option-by-name";
import useTranslate from "@src/shared/hooks/use-translate";
import closingComponents from "@src/shared/utils/closing-components";
import Autocomplete from "@src/feature/autocomplete";
import CustomInput from "@src/shared/ui/elements/custom-input";
import BuildSelectedList from "@src/feature/build-selected-list";
import CustomSelectList from "@src/feature/custom-select-list";


type Country = {
  _id: string,
  title: string,
  code: string,
  selected?: boolean
}

interface Props {
  stateName?: ExtendedModulesKey<'catalog'>,
}

function SelectCountriesList({stateName = 'catalog'}: Props) {

  const store = useStore();

  const select = useSelector((state) => ({
    countries: state.countries.list,
    waiting: state.countries.waiting,
    madeIn: state[stateName].params.madeIn
      ? state[stateName].params.madeIn.split('|')
      : [],
  }));

  const [expandList, setExpandList] = useState(false);
  const [internalCountries, setInternalCountries] = useState<Country[]>(select.countries as Country[]);
  const [listCountriesRendering, setListCountriesRendering] = useState<Country[]>([] as Country[])

  useInit(async () => {
    let currentCountries;
    if (!select.countries.length) {
      currentCountries = await store.actions.countries.loadMulti(select.madeIn)
    } else {
      currentCountries = select.countries.filter(country => select.madeIn.includes(country._id))
    }
    setListCountriesRendering(currentCountries)
  }, [select.madeIn])

  const callbacks = {
    onMadeIn: useCallback((madeIn: string) => {
      store.actions[stateName].setParams({madeIn, page: 1})
    }, [])
  }

  useEffect(() => {
    setInternalCountries(select.countries.map(country =>
      ({...country, selected: select.madeIn.includes(country._id)})
    ))
  }, [select.countries])

  const optionsBuilder = useCallback((value: string) => {
    if (!expandList) return
    const newFilteredCountries = filterOptionByName(select.countries, value) as Country[];
    setInternalCountries(newFilteredCountries.map(country => (
      {...country, selected: select.madeIn.includes(country._id)}
    )))
  }, [select.countries, select.madeIn, expandList]);

  const {t} = useTranslate();

  useEffect(() => {
    if (expandList) {
      if(!select.countries.length) store.actions.countries.load()
      return closingComponents(() => setExpandList(false))
    }
  }, [expandList]);

  const changeVisibility = () => setExpandList(prevState => !prevState);

  const onSelected = useCallback((_id: string) => {
      let newCountriesList: string[] = [];
      if (_id === '') {
        callbacks.onMadeIn('')
      } else {
        newCountriesList = select.madeIn.includes(_id)
          ? select.madeIn.filter((el) => el !== _id)
          : [...select.madeIn, _id];
        callbacks.onMadeIn(newCountriesList.join('|'));
      }
      setInternalCountries(prevState =>
        (prevState.map(country =>
          ({...country, selected: newCountriesList.includes(country._id)})
        )))
    },
    [select.countries, select.madeIn, internalCountries]
  );

  const countries = useMemo(() => {
    return [
      {_id: '', code: '', title: 'Все', selected: !select.madeIn.length},
      ...internalCountries
    ]
  }, [internalCountries])

  const autocomplete = useMemo(() => (
    <Autocomplete
      visible={expandList}
      onSelect={onSelected}
      optionsBuilder={optionsBuilder}
      filteredOptions={countries}
      inputBuilder={CustomInput}
      optionsViewBuilder={BuildSelectedList}
    />), [countries, optionsBuilder, onSelected, expandList])

  return (
    <>
      <CustomSelectList
        expandList={expandList}
        changeVisibility={changeVisibility}
        autocomplete={autocomplete}
        preparedList={listCountriesRendering}
        waiting={select.waiting}
        onSelected={onSelected}
        t={t}
      />
    </>
  );
}

export default SelectCountriesList;
