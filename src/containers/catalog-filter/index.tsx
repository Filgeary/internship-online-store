import {memo, useCallback, useMemo, useState} from "react";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Select from "@src/components/select";
import Input from "@src/components/input";
import SideLayout from "@src/components/side-layout";
import treeToList from "@src/utils/tree-to-list";
import listToTree from "@src/utils/list-to-tree";
import PropTypes from "prop-types";
import type { IQueryParams } from "@src/store/catalog/types";
import type { CatalogFilterProps } from "./types";
import MadeInAutocomplete from "@src/components/made-in-autocomplete";
import { MadeInOption } from "@src/components/made-in-autocomplete/types";

function CatalogFilter(props: CatalogFilterProps) {

  const store = useStore();
  const {t} = useTranslate();

  //Для теста  
  const [singleValue, setSingleValue] = useState<MadeInOption>()

  const select = useSelector(state => ({
    sort: state[props.catalogModuleName].params.sort,
    query: state[props.catalogModuleName].params.query,
    category: state[props.catalogModuleName].params.category,
    madeIn: state[props.catalogModuleName].params.madeIn,
    categories: state.categories.list,
    madeInList: state.manufacturer.list,
  }));

  const callbacks = {
    // Сортировка
    onSort: useCallback((sort: IQueryParams['sort']) => {store.actions[props.catalogModuleName].setParams({sort})}, [store]),
    // Поиск
    onSearch: useCallback((query: string) => store.actions[props.catalogModuleName].setParams({query, page: 1}), [store]),
    // Сброс
    onReset: useCallback(() => store.actions[props.catalogModuleName].resetParams(), [store]),
    // Фильтр по категории
    onCategory: useCallback((category: IQueryParams['category']) => store.actions[props.catalogModuleName].setParams({category, page: 1}), [store]),
    // Фильтр по стране изготовления
    onMadeIn: useCallback((option: MadeInOption) => {
      const selected = select.madeIn ? select.madeIn.split('|') : undefined
      if (!selected) return store.actions[props.catalogModuleName].setParams({madeIn: option.value, page: 1});
      const foundIndex = selected.findIndex(_id =>_id === option.value)
      const madeInArray = ((foundIndex !== -1) 
        ? [
            ...selected.slice(0, foundIndex),
            ...selected.slice(foundIndex + 1)
        ] : [
          ...selected, option.value
        ]
      )
      const madeIn = madeInArray.join('|')
      store.actions[props.catalogModuleName].setParams({madeIn, page: 1})
    }, [store, select.madeIn, props.catalogModuleName]),
    // Для теста
    onMadeInSingle: useCallback((option: MadeInOption) => {
      setSingleValue(prev => prev?.value === option.value ? undefined : option)
    },[])
  }

  const options = {
    sort: useMemo(() => ([
      {value: 'order', title: t('catalog-filter.in-order')},
      {value: 'title.ru', title: t('catalog-filter.by-naming')},
      {value: '-price', title: t('catalog-filter.expensive')},
      {value: 'edition', title: t('catalog-filter.ancient')},
    ]), [t]),

    categories: useMemo(() => ([
      {value: '', title: t('catalog-filter.all')},
      ...treeToList(listToTree(select.categories), (item, level) => (
        {value: item._id, title: '- '.repeat(level) + item.title}
      ))
    ]), [select.categories, t]),

    madeIn: useMemo(() => (
      select.madeInList.map(mi => ({
        code: mi.code,
        title: mi.title,
        value: mi._id
      }))
    ), [select.madeInList]),
  };

  const renders = {
    madeIn: useMemo(() => select.madeInList
      .filter(mi => select.madeIn
      .split('|')
      .includes(mi._id))
      .map(mi => ({
        code: mi.code,
        title: mi.title,
        value: mi._id
      })
    ), [select.madeIn, select.madeInList])
  }

  return (
    <>
      <SideLayout padding='medium'>
        <Select options={options.categories} value={select.category} onChange={callbacks.onCategory}/>
        <Select options={options.sort} value={select.sort} onChange={callbacks.onSort}/>
        <Input value={select.query} onChange={callbacks.onSearch} placeholder={t('catalog-filter.search')} delay={1000}/>
        <MadeInAutocomplete options={options.madeIn} value={renders.madeIn} onSelect={callbacks.onMadeIn} multiple/>
        <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
      </SideLayout>
      <SideLayout padding='medium'>
        <MadeInAutocomplete options={options.madeIn} value={singleValue} onSelect={callbacks.onMadeInSingle}/>
      </SideLayout>
    </>
  )
}

CatalogFilter.propTypes = {
  catalogModuleName: PropTypes.string
}

CatalogFilter.defaultProps = {
  catalogModuleName: 'catalog'
}

export default memo(CatalogFilter);
