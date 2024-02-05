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

function CatalogFilter(props) {

  const store = useStore();
  const {t} = useTranslate();

  const select = useSelector(state => ({
    sort: state[props.catalogSliceName].params.sort,
    query: state[props.catalogSliceName].params.query,
    category: state[props.catalogSliceName].params.category,
    categories: state.categories.list,
  }));

  const callbacks = {
    // Сортировка
    onSort: useCallback(sort => store.actions[props.catalogSliceName].setParams({sort}), [store]),
    // Поиск
    onSearch: useCallback(query => store.actions[props.catalogSliceName].setParams({query, page: 1}), [store]),
    // Сброс
    onReset: useCallback(() => store.actions[props.catalogSliceName].resetParams(), [store]),
    // Фильтр по категории
    onCategory: useCallback(category => store.actions[props.catalogSliceName].setParams({category, page: 1}), [store]),
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
      <Input value={select.query} onChange={callbacks.onSearch} placeholder={t('catalog-filter.search')}
             delay={1000}/>
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </SideLayout>
  )
}

CatalogFilter.propTypes = {
  catalogSliceName: PropTypes.string
}

CatalogFilter.defaultProps = {
  catalogSliceName: 'catalog'
}

export default memo(CatalogFilter);
