import {memo, useCallback, useEffect, useMemo, useState} from "react";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Select from "@src/components/select";
import Input from "@src/components/input";
import SideLayout from "@src/components/side-layout";
import treeToList from "@src/utils/tree-to-list";
import listToTree from "@src/utils/list-to-tree";

function CatalogFilter({state, setParams, resetParams}) {

  const store = useStore();

  const select = useSelector(state => ({
    params: state.catalog.params,
    categories: state.categories.list,
  }));

  const [localState, setLocalState] = useState(state || select)

  // Чтобы избежать дублирования, функция будет вызываться в зависимости от того где она вызывается, идет определение, если мы находимся "внутри какого-либо компонента" то будем вызывать переданный им метод, если же нет, то брать функцию из стора, это поможет избежать лишних проверок
  const resetParameters = useCallback(() => {
    state ? resetParams() : store.actions.catalog.resetParams();
  }, [])
  // Идентичная ситуация
  const setParameters = useCallback((parameters) => {
    state ? setParams(parameters) : store.actions.catalog.setParams(parameters);
  }, [])


  useEffect(() => {
    if (state) setLocalState(state)
    else setLocalState(select)
  }, [state, select.params, select.categories]);


  const callbacks = {
    // Сортировка
    onSort: useCallback(sort => {
      setParameters({sort})
    }, [store, localState]),
    // Поиск
    onSearch: useCallback(query => {
      setParameters({query, page: 1})
    }, [store, localState]),
    // Сброс
    onReset: useCallback(() => {
      resetParameters()
    }, [store, localState]),
    // Фильтр по категории
    onCategory: useCallback(category => {
      setParameters({category, page: 1})
    }, [store, localState]),
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
      ...treeToList(listToTree(localState.categories), (item, level) => (
        {value: item._id, title: '- '.repeat(level) + item.title}
      ))
    ]), [localState.categories]),
  };

  const {t} = useTranslate();

  return (
    <SideLayout padding='medium'>
      <Select options={options.categories} value={localState.params.category} onChange={callbacks.onCategory}/>
      <Select options={options.sort} value={localState.params.sort} onChange={callbacks.onSort}/>
      <Input value={localState.params.query} onChange={callbacks.onSearch} placeholder={'Поиск'}
             delay={1000}/>
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </SideLayout>
  )
}

export default memo(CatalogFilter);
