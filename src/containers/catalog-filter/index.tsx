import { memo, useCallback, useMemo } from 'react';

import Input from '@src/components/input';
import Select from '@src/components/select';
import SelectAutocomplete from '@src/components/select-autocomplete';
import SideLayout from '@src/components/side-layout';
import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';
import { diff } from '@src/utils/diff';
import listToTree from '@src/utils/list-to-tree';
import treeToList from '@src/utils/tree-to-list';

import type { ISelectOption } from '@src/types';

const IS_MULTI_SELECT = true;

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
      (country: ISelectOption[]) => {
        store.actions[catalogSliceName].setParams({ madeIn: country.at(0)?._id, page: 1 });
      },
      [catalogSliceName, store],
    ),
    // Фильтр по множеству странам, также работает при Unselect
    onFilterByCountries: useCallback(
      (countriesParams: ISelectOption[]) => {
        let filteredCountriesIds = [] as string[];

        // check if default country was selected
        if (countriesParams.some(({ _id }) => _id === '')) {
          filteredCountriesIds = [];
        } else {
          filteredCountriesIds = [
            ...diff(
              select.madeIn.split('|'),
              countriesParams.map(({ _id }) => _id),
            ),
          ];

          if (filteredCountriesIds.length > 1) {
            filteredCountriesIds = filteredCountriesIds.filter(Boolean); // filter default country
          }
        }

        store.actions[catalogSliceName].setParams({
          madeIn: filteredCountriesIds.join('|'),
          page: 1,
        });
      },
      [catalogSliceName, store, select.madeIn],
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

  const memoSelectedItems = useMemo(() => {
    let filteredItems = options.countries.filter(item => select.madeIn.includes(item._id));
    if (filteredItems.length > 1) {
      filteredItems = filteredItems.filter(item => item._id !== '');
    }

    return filteredItems;
  }, [options.countries, select.madeIn]);

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
        onSelected={IS_MULTI_SELECT ? callbacks.onFilterByCountries : callbacks.onFilterByCountry}
        selectedItems={memoSelectedItems}
        defaultSelectedItem={options.countries[0]}
        isPending={select.waitingCountries}
        onOpen={callbacks.onLoadCountries}
        isMulti={IS_MULTI_SELECT}
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
