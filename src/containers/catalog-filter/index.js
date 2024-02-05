import {memo, useCallback, useMemo} from "react";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Select from "@src/components/select";
import Input from "@src/components/input";
import SideLayout from "@src/components/side-layout";
import treeToList from "@src/utils/tree-to-list";
import listToTree from "@src/utils/list-to-tree";
import Button from "@src/components/button";

function CatalogFilter(props) {

  const store = useStore();

  const context = {
    // Форк или оригинал
    name: props.context ?? 'catalog',
  }

  const select = useSelector(state => ({
    sort: state[context.name].params.sort,
    query: state[context.name].params.query,
    category: state[context.name].params.category,
    isInitParams: state[context.name].isInitParams,
    categories: state.categories.list,
  }));

  const callbacks = {
    // Сортировка
    onSort: useCallback(sort => store.actions[context.name].setParams({sort}), [store]),
    // Поиск
    onSearch: useCallback(query => store.actions[context.name].setParams({query, page: 1}), [store]),
    // Сброс
    onReset: useCallback(() => store.actions[context.name].resetParams(), [store]),
    // Фильтр по категории
    onCategory: useCallback(category => store.actions[context.name].setParams({category, page: 1}), [store]),
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
             delay={500}/>
      <Button onClick={callbacks.onReset} value={t('filter.reset')} disabled={select.isInitParams} />
    </SideLayout>
  )
}

export default memo(CatalogFilter);
