import {memo, useCallback, useMemo} from "react";
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

function CatalogFilter(props: CatalogFilterProps) {

  const store = useStore();
  const {t} = useTranslate();

  const select = useSelector(state => ({
    sort: state[props.catalogModuleName].params.sort,
    query: state[props.catalogModuleName].params.query,
    category: state[props.catalogModuleName].params.category,
    categories: state.categories.list,
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
  };

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
  };

  return (
    <SideLayout padding='medium'>
      <Select options={options.categories} value={select.category} onChange={callbacks.onCategory}/>
      <Select options={options.sort} value={select.sort} onChange={callbacks.onSort}/>
      <Input value={select.query} onChange={callbacks.onSearch} placeholder={t('catalog-filter.search')} delay={1000}/>
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </SideLayout>
  )
}

CatalogFilter.propTypes = {
  catalogModuleName: PropTypes.string
}

CatalogFilter.defaultProps = {
  catalogModuleName: 'catalog'
}

export default memo(CatalogFilter);
