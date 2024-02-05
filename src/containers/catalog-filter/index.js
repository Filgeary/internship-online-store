import {memo, useCallback, useEffect, useMemo, useState} from "react";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Select from "@src/components/select";
import Input from "@src/components/input";
import SideLayout from "@src/components/side-layout";
import treeToList from "@src/utils/tree-to-list";
import listToTree from "@src/utils/list-to-tree";
import PropTypes from "prop-types";

function CatalogFilter({stateName}) {

  const store = useStore();

  const select = useSelector(state => ({
    params: state[stateName].params,
    categories: state.categories.list,
  }));

  const callbacks = {
    // Сортировка
    onSort: useCallback(sort => {
      store.actions[stateName].setParams({sort})
    }, []),
    // Поиск
    onSearch: useCallback(query => {
      store.actions[stateName].setParams({query, page: 1})
    }, []),
    // Сброс
    onReset: useCallback(() => {
      store.actions[stateName].resetParams()
    }, []),
    // Фильтр по категории
    onCategory: useCallback(category => {
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
      ...treeToList(listToTree(select.categories), (item, level) => (
        {value: item._id, title: '- '.repeat(level) + item.title}
      ))
    ]), [select.categories]),
  };

  const {t} = useTranslate();

  return (
    <SideLayout padding='medium'>
      <Select options={options.categories} value={select.params.category} onChange={callbacks.onCategory}/>
      <Select options={options.sort} value={select.params.sort} onChange={callbacks.onSort}/>
      <Input value={select.params.query} onChange={callbacks.onSearch} placeholder={'Поиск'}
             delay={1000}/>
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </SideLayout>
  )
}

CatalogFilter.prototype = {
  stateName: PropTypes.string
}

CatalogFilter.defaultProps = {
  stateName: 'catalog'
}


export default memo(CatalogFilter);
