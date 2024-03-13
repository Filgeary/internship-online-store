import React, {memo, useCallback, useEffect, useMemo} from "react";
import useTranslate from "../../ww-old-hooks-postponed/use-translate";
import useStore from "../../ww-old-hooks-postponed/use-store";
import useSelector from "../../ww-old-hooks-postponed/use-selector";
import Select, {Option} from "@src/ww-old-components-postponed/select";
import Input from "@src/ww-old-components-postponed/input";
import SideLayout from "@src/ww-old-components-postponed/side-layout";
import treeToList from "@src/ww-old-utils-postponed/tree-to-list";
import listToTree from "@src/ww-old-utils-postponed/list-to-tree";
import {ExtendedModulesKey} from "@src/ww-old-store-postponed-modals/types";
import {TSort} from "@src/ww-old-store-postponed-modals/catalog";
import SelectCountriesList from "@src/ww-old-containers/select-countries-list";

interface Props {
  stateName?: ExtendedModulesKey<'catalog'>,
}

const CatalogFilter: React.FC<Props> = ({stateName = 'catalog'}) => {

  const store = useStore();

  const select = useSelector((state) => ({
    params: state[stateName].params,
    categories: state.categories.list,
  }));

  const callbacks = {
    // Сортировка
    onSort: useCallback((sort: TSort) => {
      store.actions[stateName].setParams({sort})
    }, []),
    // Поиск
    onSearch: useCallback((query: string, name: 'filter') => {
      store.actions[stateName].setParams({query, page: 1})
    }, []),
    // Сброс
    onReset: useCallback(() => {
      store.actions[stateName].resetParams()
    }, []),
    // Фильтр по категории
    onCategory: useCallback((category: string) => {
      store.actions[stateName].setParams({category, page: 1})
    }, []),
    onMadeIn: useCallback((madeIn: string) => {
      store.actions[stateName].setParams({madeIn, page: 1})
    }, [])
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
      ...treeToList<Option>(listToTree(select.categories), (item, level) => (
        {value: item._id, title: '- '.repeat(level) + item.title}
      ))
    ]), [select.categories]),

  };

  const {t} = useTranslate();

  return (
    <SideLayout padding='medium'>
      <Select options={options.categories} value={select.params.category} onChange={callbacks.onCategory}/>
      <Select options={options.sort} value={select.params.sort} onChange={callbacks.onSort}/>
      <Input<'filter'> name={'filter'} value={select.params.query} onChange={callbacks.onSearch} placeholder={'Поиск'}
             delay={1000}/>
      <SelectCountriesList stateName={stateName}/>
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </SideLayout>
  )
}

export default memo(CatalogFilter);
