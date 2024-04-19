import { Button, Input, Select, Space } from 'antd';
import debounce from 'lodash.debounce';
import { memo, useCallback, useLayoutEffect, useMemo, useState } from 'react';

import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';
import listToTree from '@src/utils/list-to-tree';
import treeToList from '@src/utils/tree-to-list';
import SelectFieldOptionCountry from '../ui/select-field-option-country';
import SelectFieldTagCountry from '../ui/select-field-tag-country';

const IS_TEST = process.env.NODE_ENV === 'test';

type Props = {
  catalogSliceName?: 'catalog' | `catalog${number}`;
};

function AdminCatalogFilter({ catalogSliceName = 'catalog' }: Props) {
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

  const [inputValueQuery, setInputValueQuery] = useState(select.query);

  const callbacks = {
    // Сортировка
    onSort: useCallback(
      (sort: string) => store.actions[catalogSliceName].setParams({ sort }),
      [catalogSliceName, store],
    ),
    // Поиск
    // eslint-disable-next-line react-hooks/exhaustive-deps
    onSearchDebounced: useCallback(
      debounce(
        (query: string) => store.actions[catalogSliceName].setParams({ query, page: 1 }),
        IS_TEST ? 0 : 500,
      ),
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
    // Фильтр по множеству странам
    onFilterByCountries: useCallback(
      (countriesSelectedValues: string[]) => {
        const filteredCountriesIds = [] as string[];

        if (countriesSelectedValues.length > 0) {
          filteredCountriesIds.push(
            ...select.countries
              .filter(item => countriesSelectedValues.includes(item.code))
              .map(item => item._id),
          );
        }

        store.actions[catalogSliceName].setParams({
          madeIn: filteredCountriesIds.join('|'),
          page: 1,
        });
      },
      [catalogSliceName, store, select.countries],
    ),
    // Загрузка стран
    onLoadCountries: useCallback(async () => {
      if (select.countries.length === 0) await store.actions.countries.load();
    }, [select.countries.length, store]),
  };

  const options = {
    sort: useMemo(
      () => [
        { value: 'order', label: 'По порядку' },
        { value: 'title.ru', label: 'По именованию' },
        { value: '-price', label: 'Сначала дорогие' },
        { value: 'edition', label: 'Древние' },
      ],
      [],
    ),
    categories: useMemo(
      () => [
        { value: '', label: 'Все' },
        ...treeToList(listToTree(select.categories), (item: any, level: number) => ({
          value: item._id,
          label: '- '.repeat(level) + item.title,
        })),
      ],
      [select.categories],
    ),
    countries: useMemo(
      () => [
        ...select.countries.map(item => ({ _id: item._id, value: item.code, label: item.title })),
      ],
      [select.countries],
    ),
  };

  const memoSelectedItems = useMemo(() => {
    const filteredItems = options.countries
      ?.filter(item => select.madeIn.includes(item._id))
      ?.filter(item => item._id !== '')
      .map(item => item.value);

    return filteredItems;
  }, [options.countries, select.madeIn]);

  const handleChangeInputQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueQuery(e.target.value);
    callbacks.onSearchDebounced(e.target.value);
  };

  // update with LayoutEffect on goto with direct url
  useLayoutEffect(() => {
    setInputValueQuery(select.query);
  }, [select.query]);

  return (
    <Space>
      <Select
        value={select.category}
        onChange={callbacks.onCategory}
        options={options.categories}
        style={{ minWidth: 200 }}
      />
      <Select
        value={select.sort}
        onChange={callbacks.onSort}
        options={options.sort}
        style={{ minWidth: 200 }}
      />
      <Select
        mode={'multiple'}
        placeholder='Страна'
        options={options.countries}
        value={memoSelectedItems}
        onChange={callbacks.onFilterByCountries}
        onDropdownVisibleChange={isOpen => isOpen && callbacks.onLoadCountries()}
        maxTagCount={'responsive'}
        optionRender={option => (
          <SelectFieldOptionCountry
            value={option.data.value}
            label={option.data.label}
          />
        )}
        tagRender={SelectFieldTagCountry}
        style={{ minWidth: 240 }}
      />
      <Input
        name='query'
        value={inputValueQuery}
        onChange={handleChangeInputQuery}
        placeholder='Поиск'
        style={{ minWidth: 200 }}
      />
      <Button
        type='dashed'
        danger
        onClick={callbacks.onReset}
        style={{ minWidth: 200 }}
      >
        {t('filter.reset')}
      </Button>
    </Space>
  );
}

export default memo(AdminCatalogFilter);
