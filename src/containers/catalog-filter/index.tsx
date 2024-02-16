import React, {memo, useCallback, useMemo} from "react";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Select, {Option} from "@src/components/select";
import Input from "@src/components/input";
import SideLayout from "@src/components/side-layout";
import treeToList from "@src/utils/tree-to-list";
import listToTree from "@src/utils/list-to-tree";
import {ExtendedModulesAllKey, ExtendedModulesKey} from "@src/store/types";
import {Params, TSort} from "@src/store/catalog";

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
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </SideLayout>
  )
}

export default memo(CatalogFilter);
