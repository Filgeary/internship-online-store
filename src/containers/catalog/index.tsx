import React, { memo, createContext, useContext, useCallback } from 'react';

import useStore from '@src/hooks/use-store';
import { useAppSelector } from '@src/hooks/use-selector';
import { TGlobalActions, TGlobalState } from '@src/store/types';

const CatalogContext = createContext(null);

export const useCatalog = () => {
  const ctx = useContext(CatalogContext);

  if (!ctx) {
    throw new Error(
      'Компоненты каталога должны быть обёрнуты в компонент <Catalog />.'
    );
  }

  return ctx;
};

type CatalogProps = {
  children?: React.ReactNode;
  stateName: string;
};

function Catalog({ children, ...props }: CatalogProps) {
  const store = useStore();

  const select = useAppSelector((state) => ({
    list: state[props.stateName].list,
    page: state[props.stateName].params.page,
    limit: state[props.stateName].params.limit,
    count: state[props.stateName].count,
    waiting: state[props.stateName].waiting,
    activeItemBasket: state.basket.active,

    sort: state[props.stateName].params.sort,
    query: state[props.stateName].params.query,
    category: state[props.stateName].params.category,
    categories: state.categories.list,
  }));

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(
      (_id: string | number) => store.actions.basket.addToBasket(_id),
      [store]
    ),
    // Пагинация
    onPaginate: useCallback(
      (page: number) =>
        store.actions[props.stateName].setParams({ page }, false),
      [store]
    ),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback(
      (page: string) => {
        return `?${new URLSearchParams({ page, limit: select.limit, sort: select.sort, query: select.query })}`;
      },
      [select.limit, select.sort, select.query]
    ),
    // Открыть модалку с выбором количества товара для добавления
    openModalOfCount: useCallback(
      (item: TArticle) => {
        store.actions.basket.setActive(item);
        const promiseOfModal = store.actions.modals.open('countModal');

        promiseOfModal
          .then(() => {
            store.actions.basket.addActiveToBasket();
          })
          .catch(() => {})
          .finally(() => {
            store.actions.basket.resetActive();
          });
      },
      [store, select.list]
    ),
    // Сортировка
    onSort: useCallback(
      (sort: string) =>
        store.actions[props.stateName].setParams({ sort }, false),
      [store]
    ),
    // Поиск
    onSearch: useCallback(
      (query: string) =>
        store.actions[props.stateName].setParams({ query, page: 1 }, false),
      [store]
    ),
    // Сброс
    onReset: useCallback(
      () => store.actions[props.stateName].resetParams(),
      [store]
    ),
    // Фильтр по категории
    onCategory: useCallback(
      (category: string) =>
        store.actions[props.stateName].setParams({ category, page: 1 }, false),
      [store]
    ),
  };

  return (
    <CatalogContext.Provider value={{ select, callbacks }}>
      {children}
    </CatalogContext.Provider>
  );
}

export default memo(Catalog);
