import {memo, useCallback, useMemo} from "react";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Select from "@src/components/select";
import Input from "@src/components/input";
import SideLayout from "@src/components/side-layout";
import treeToList from "@src/utils/tree-to-list";
import listToTree from "@src/utils/list-to-tree";

function CatalogFilter({
  isModal = false,
  storeSlice = 'catalog'
}) {

  const store = useStore();

  const select = useSelector(state => ({
    sort: state[storeSlice].params.sort,
    query: state[storeSlice].params.query,
    category: state[storeSlice].params.category,
    categories: state.categories.list,
  }));

  const callbacks = {
    // Сортировка
    onSort: useCallback(sort => store.actions[storeSlice].setParams({sort}, false, !isModal), [store]),
    // Поиск
    onSearch: useCallback(query => store.actions[storeSlice].setParams({query, page: 1}, false, !isModal), [store]),
    // Сброс
    onReset: useCallback(() => store.actions[storeSlice].resetParams({}, !isModal), [store]),
    // Фильтр по категории
    onCategory: useCallback(category => store.actions[storeSlice].setParams({category, page: 1}, false, !isModal), [store]),
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
      <Select options={options.categories} value={select.category} onChange={callbacks.onCategory}/>
      <Select options={options.sort} value={select.sort} onChange={callbacks.onSort}/>
      <Input value={select.query} onChange={callbacks.onSearch} placeholder={'Поиск'}
             delay={1000}/>
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </SideLayout>
  )
}

export default memo(CatalogFilter);
