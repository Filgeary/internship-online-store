import React, { memo, createContext, useContext, useCallback } from 'react';

import useStore from '@src/hooks/use-store';
import { useAppSelector } from '@src/hooks/use-selector';

const CatalogContext = createContext(null);

export const useCatalogContext = () => {
  const ctx = useContext(CatalogContext);

  if (!ctx) {
    throw new Error('Компоненты каталога должны быть обёрнуты в компонент <Catalog />.');
  }

  return ctx;
};

type CatalogProps = {
  children?: React.ReactNode;
  stateName: 'catalog' | `catalog-${string}`;
};

function Catalog({ children, stateName }: CatalogProps) {
  const store = useStore();

  const select = useAppSelector((state) => ({
    list: state[stateName].list,
    page: state[stateName].params.page,
    limit: state[stateName].params.limit,
    count: state[stateName].count,
    waiting: state[stateName].waiting,
    activeItemBasket: state.basket.active,

    sort: state[stateName].params.sort,
    query: state[stateName].params.query,
    category: state[stateName].params.category,
    country: state[stateName].params.country,

    categories: state.categories.list,
    countries: state.countries.list,
  }));

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(
      (_id: string | number) => store.actions.basket.addToBasket(_id),
      [store]
    ),
    // Пагинация
    onPaginate: useCallback(
      (page: number) => store.actions[stateName].setParams({ page }, false),
      [store]
    ),
    // Генератор ссылки для пагинатора
    makePaginatorLink: useCallback(
      (page: string) => {
        return `?${new URLSearchParams({ page, limit: select.limit, sort: select.sort, query: select.query } as Record<string, any>)}`;
      },
      [select.limit, select.sort, select.query]
    ),
    // Открыть модалку с выбором количества товара для добавления
    openModalOfCount: useCallback(
      (item: TArticle) => {
        store.actions.basket.setActive(item);
        const promiseOfModal = store.actions.modals.open('countModal');

        promiseOfModal
          .then(async () => {
            await store.actions.basket.addActiveToBasket();
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
      (sort: string) => store.actions[stateName].setParams({ sort }, false),
      [store]
    ),
    // Поиск
    onSearch: useCallback(
      (query: string) => store.actions[stateName].setParams({ query, page: 1 }, false),
      [store]
    ),
    // Сброс
    onReset: useCallback(() => store.actions[stateName].resetParams(), [store]),
    // Фильтр по категории
    onCategory: useCallback(
      (category: string) => store.actions[stateName].setParams({ category, page: 1 }, false),
      [store]
    ),
    // Выбор страны
    onCountrySelected: useCallback(
      (country: string) => {
        store.actions[stateName].setParams({ country, page: 1 }, false);
      },
      [store]
    ),
  };

  return (
    <CatalogContext.Provider value={{ select, callbacks }}>{children}</CatalogContext.Provider>
  );
}

export default memo(Catalog);
