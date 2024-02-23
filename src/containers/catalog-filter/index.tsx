import { memo, useCallback, useMemo } from 'react';

import Input from '@src/components/input';
import Select from '@src/components/select';
import SelectAutocomplete from '@src/components/select-autocomplete';
import SideLayout from '@src/components/side-layout';
import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';
import listToTree from '@src/utils/list-to-tree';
import treeToList from '@src/utils/tree-to-list';

import type { ISelectOption } from '@src/types';

type Props = {
  catalogSliceName?: 'catalog' | `catalog${number}`;
};

function CatalogFilter({ catalogSliceName = 'catalog' }: Props) {
  const store = useStore();
  const { t } = useTranslate();

  const select = useSelector(state => ({
    sort: state[catalogSliceName].params.sort,
    query: state[catalogSliceName].params.query,
    category: state[catalogSliceName].params.category,
    madeIn: state[catalogSliceName].params.madeIn,
    categories: state.categories.list,
    countries: state.countries.list,
    waitingCountries: state.countries.waiting,
  }));

  const callbacks = {
    // Сортировка
    onSort: useCallback(
      (sort: string) => store.actions[catalogSliceName].setParams({ sort }),
      [catalogSliceName, store],
    ),
    // Поиск
    onSearch: useCallback(
      (query: string) => store.actions[catalogSliceName].setParams({ query, page: 1 }),
      [catalogSliceName, store],
    ),
    // Сброс
    onReset: useCallback(
      () => store.actions[catalogSliceName].resetParams(),
      [catalogSliceName, store],
    ),
    // Фильтр по категории
    onCategory: useCallback(
      (category: string) => store.actions[catalogSliceName].setParams({ category, page: 1 }),
      [catalogSliceName, store],
    ),
    // Фильтр по стране
    onFilterByCountry: useCallback(
      (country: ISelectOption) => {
        store.actions[catalogSliceName].setParams({ madeIn: country._id, page: 1 });
      },
      [catalogSliceName, store],
    ),
    // Загрузка стран
    onLoadCountries: useCallback(async () => {
      if (select.countries.length === 0) await store.actions.countries.load();
    }, [select.countries.length, store]),
  };

  const options = {
    sort: useMemo(
      () => [
        { value: 'order', title: 'По порядку' },
        { value: 'title.ru', title: 'По именованию' },
        { value: '-price', title: 'Сначала дорогие' },
        { value: 'edition', title: 'Древние' },
      ],
      [],
    ),
    categories: useMemo(
      () => [
        { value: '', title: 'Все' },
        ...treeToList(listToTree(select.categories), (item: any, level: number) => ({
          value: item._id,
          title: '- '.repeat(level) + item.title,
        })),
      ],
      [select.categories],
    ),
    countries: useMemo(
      () => [
        { _id: '', value: '', title: 'Все' },
        ...select.countries.map(item => ({ _id: item._id, value: item.code, title: item.title })),
      ],
      [select.countries],
    ),
  };

  return (
    <SideLayout padding='medium'>
      <Select
        options={options.categories}
        value={select.category}
        onChange={callbacks.onCategory}
      />
      <Select
        options={options.sort}
        value={select.sort}
        onChange={callbacks.onSort}
      />
      <SelectAutocomplete
        options={options.countries}
        onSelected={callbacks.onFilterByCountry}
        selectedItem={options.countries.find(item => item._id === select.madeIn) || null}
        defaultSelectedItem={options.countries[0]}
        isPending={select.waitingCountries}
        onOpen={callbacks.onLoadCountries}
      />
      <Input
        name='query'
        value={select.query}
        onChange={callbacks.onSearch}
        placeholder={'Поиск'}
        delay={1000}
      />
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </SideLayout>
  );
}

export default memo(CatalogFilter);
