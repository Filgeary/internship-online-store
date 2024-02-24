import {memo, useCallback, useMemo, useState} from "react";
import useTranslate from "../../hooks/use-translate";
import useStore from "../../hooks/use-store";
import useSelector from "../../hooks/use-selector";
import Select from "../../components/select";
import Input from "../../components/input";
import SideLayout from "../../components/side-layout";
import treeToList from "../../utils/tree-to-list";
import listToTree from "../../utils/list-to-tree";
import { ExtendedModulesKeys, ModulesKeys } from "../../store/types";
import { CategoryType } from "../../store/categories/types";
import Selector from "../../components/selector";
import { CountryType } from "../../store/countries/types";
import SelectorItem from "../../components/selector-item";
import SelectorItemMulti from "../../components/selector-item-multi";

export type CatalogFilterPropsType<T extends ModulesKeys> = {
  storeSlice?: ExtendedModulesKeys<T>
}

function CatalogFilter({
  storeSlice = 'catalog'
}: CatalogFilterPropsType<'catalog'>) {

  const store = useStore();
  const [countriesFilter, setCountriesFilter] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([''])

  const select = useSelector(state => ({
    sort: state[storeSlice].params.sort,
    query: state[storeSlice].params.query,
    category: state[storeSlice].params.category,
    categories: state.categories.list,
    countries: state.countries.list,
    country: state[storeSlice].params.madeIn,
  }));

  const callbacks = {
    // Сортировка
    onSort: useCallback((sort: string) => store.actions[storeSlice].setParams({sort}), [store]),
    // Поиск
    onSearch: useCallback((query: string) => store.actions[storeSlice].setParams({query, page: 1}), [store]),
    // Сброс
    onReset: useCallback(() => store.actions[storeSlice].resetParams({}), [store]),
    // Фильтр по категории
    onCategory: useCallback((category: string) => store.actions[storeSlice].setParams({category, page: 1}), [store]),
    //Фильтр по стране
    onCountry: useCallback((madeIn: string[]) => {
      store.actions[storeSlice].setParams({ madeIn: madeIn.join("|") });
      setSelectedCountries(madeIn)
    }, [store]),
  };

  const options = {
    sort: useMemo(() => ([
      {value: 'order', title: 'По порядку'},
      {value: 'title.ru', title: 'По именованию'},
      {value: '-price', title: 'Сначала дорогие'},
      {value: 'edition', title: 'Древние'},
    ]), []),
    categories: useMemo(() => ([
      {value: '', title: 'Все'},
      ...treeToList(listToTree(select.categories), (item: CategoryType, level: number) => (
        {value: item._id, title: '- '.repeat(level) + item.title}
      ))
    ]), [select.categories]),
    countries: useMemo(() =>{
      const countries = select.countries.filter(c => c.title.toLocaleLowerCase().includes(countriesFilter.toLocaleLowerCase()));
      return [ {_id: '', title: 'Все', code: ''}, ...countries]
    }, [select.countries, countriesFilter]),
    selectedCountries: useMemo(() => {
      let countries: CountryType[] = [];
      if(selectedCountries.length === 1) {
        const country = select.countries.find(c => c._id === selectedCountries[0]);
        countries.push(country || {_id: '', title: 'Все', code: ''})
      } else {
        countries = select.countries.filter(c => !!selectedCountries.find(i => i === c._id) )
      }
      return countries
    }, [selectedCountries])
  };

  const {t} = useTranslate();

  const renders = {
    dropdownItem: useCallback((item: CountryType, isSelected?: boolean, isHovered?: boolean) => (
      <SelectorItem item={item} isSelected={isSelected} isHovered={isHovered} />
    ), []),
    selectedOneItem: useCallback((item: CountryType) => (
      <SelectorItem item={item} />
    ), []),
    selectedMultiItem: useCallback((item: CountryType)=>(
      <SelectorItemMulti item={item}/>
    ),[])
  }


  return (
    <SideLayout padding='medium'>
      <Select options={options.categories} value={select.category} onChange={callbacks.onCategory}/>
      <Select options={options.sort} value={select.sort} onChange={callbacks.onSort}/>
      <Selector options={options.countries}
                selected={options.selectedCountries}
                selectOneRender={renders.selectedOneItem}
                selectMultiRender={renders.selectedMultiItem}
                onChange={callbacks.onCountry}
                dropdownItem={renders.dropdownItem}
                filter={countriesFilter}
                onChangeFilter={setCountriesFilter}/>
      <Input value={select.query} onChange={callbacks.onSearch} placeholder={'Поиск'}
             delay={1000}/>
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </SideLayout>
  )
}

export default memo(CatalogFilter);
