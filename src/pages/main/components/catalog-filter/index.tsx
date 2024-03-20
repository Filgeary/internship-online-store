import React, {memo, useCallback, useMemo} from "react";
import {ExtendedModulesKey} from "@src/shared/store/types";
import useStore from "@src/shared/hooks/use-store";
import useSelector from "@src/shared/hooks/use-selector";
import {TSort} from "@src/pages/main/store/catalog/types";
import treeToList from "@src/shared/utils/tree-to-list";
import listToTree from "@src/shared/utils/list-to-tree";
import useTranslate from "@src/shared/hooks/use-translate";
import SideLayout from "@src/shared/ui/layout/side-layout";
import Select from "@src/shared/ui/elements/select";
import Input from "@src/shared/ui/elements/input";
import SelectCountriesList from "@src/feature/select-countries-list";

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
      ...treeToList<any>(listToTree(select.categories), (item, level) => (
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
