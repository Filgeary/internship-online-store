import { memo, useCallback, useMemo, useState } from 'react';

import Input from '@src/components/input';
import Select from '@src/components/select';
import SelectAutocomplete from '@src/components/select-autocomplete';
import SideLayout from '@src/components/side-layout';
import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';
import listToTree from '@src/utils/list-to-tree';
import treeToList from '@src/utils/tree-to-list';

const countries = [
  { code: '', title: 'Все' },
  { code: 'US', title: 'United States' },
  { code: 'CN', title: 'China' },
  { code: 'IN', title: 'India' },
  { code: 'BR', title: 'Brazil' },
  { code: 'RU', title: 'Russia' },
  { code: 'FR', title: 'France' },
  { code: 'DE', title: 'Germany' },
  { code: 'GB', title: 'United Kingdom | Great Britain' },
].map(item => ({ _id: String(item.code), value: item.code, title: item.title }));

type Props = {
  catalogSliceName?: 'catalog' | `catalog${number}`;
};

function CatalogFilter({ catalogSliceName = 'catalog' }: Props) {
  const store = useStore();
  const { t } = useTranslate();
  const [selectedItem, setSelectedItem] = useState(() => countries[0]);

  const select = useSelector(state => ({
    sort: state[catalogSliceName].params.sort,
    query: state[catalogSliceName].params.query,
    category: state[catalogSliceName].params.category,
    categories: state.categories.list,
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
    onFilterByCountry: (country: (typeof countries)[0]) => {
      console.log('🚀 => CatalogFilter => country:', country);
      setSelectedItem(country);
    },
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
        options={countries}
        onSelected={callbacks.onFilterByCountry}
        selectedItem={selectedItem}
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
