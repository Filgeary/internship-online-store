import React, { useCallback, useMemo } from 'react';
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import SideLayout from "@src/components/side-layout";
import Select from "@src/components/select";
import Input from "@src/components/input";
import useStore from "@src/hooks/use-store";
import treeToList from "@src/utils/tree-to-list";
import listToTree from "@src/utils/list-to-tree";

const CatalogFilterContent = ({ sort, query, category, onSort, onSearch, onReset, onCategory, options, t }) => {
    return (
      <SideLayout padding='medium'>
        <Select options={options.categories} value={category} onChange={onCategory}/>
        <Select options={options.sort} value={sort} onChange={onSort}/>
        <Input value={query} onChange={onSearch} placeholder={'Поиск'} delay={1000}/>
        <button onClick={onReset}>{t('filter.reset')}</button>
      </SideLayout>
    );
  };

 function withCatalogFilter(WrappedComponent, params) {
    const { stateSelector, actionSetParams, actionResetParams } = params;

  return function CatalogFilterHOC() {
    const store = useStore();

    const select = useSelector(stateSelector);

    const callbacks = {
      onSort: useCallback(sort => store.actions[actionSetParams].setParams({ sort }), [store, actionSetParams]),
      onSearch: useCallback(query => store.actions[actionSetParams].setParams({ query, page: 1 }), [store, actionSetParams]),
      onReset: useCallback(() => store.actions[actionResetParams].resetParams(), [store, actionResetParams]),
      onCategory: useCallback(category => store.actions[actionSetParams].setParams({ category, page: 1 }), [store, actionSetParams]),
    }

    const options = useMemo(() => ({
      sort: [
        { value: 'order', title: 'По порядку' },
        { value: 'title.ru', title: 'По именованию' },
        { value: '-price', title: 'Сначала дорогие' },
        { value: 'edition', title: 'Древние' },
      ],
      categories: [
        { value: '', title: 'Все' },
        ...treeToList(listToTree(select.categories), (item, level) => (
          { value: item._id, title: '- '.repeat(level) + item.title }
        ))
      ]
    }), [select.categories]);

    const { t } = useTranslate();

    return (
       <WrappedComponent {...select} {...callbacks} options={options} t={t} />
    );
  };
}

const CatalogFilter = withCatalogFilter(CatalogFilterContent, {
  stateSelector: state => ({
    sort: state.catalog.params.sort,
    query: state.catalog.params.query,
    category: state.catalog.params.category,
    categories: state.categories.list,
  }),
  actionSetParams: 'catalog',
  actionResetParams: 'catalog',
});

const CatalogFilterForModal = withCatalogFilter(CatalogFilterContent, {
  stateSelector: state => ({
    sort: state.catalog_modal.params.sort,
    query: state.catalog_modal.params.query,
    category: state.catalog_modal.params.category,
    categories: state.categories.list,
  }),
  actionSetParams: 'catalog_modal',
  actionResetParams: 'catalog_modal',
});

 export { CatalogFilter, CatalogFilterForModal };
