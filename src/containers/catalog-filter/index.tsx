import { memo, useMemo, useState } from 'react';

import useTranslate from '@src/hooks/use-translate';

import Select from '@src/components/select';
import Input from '@src/components/input';
import SideLayout from '@src/components/side-layout';
import treeToList from '@src/utils/tree-to-list';
import listToTree from '@src/utils/list-to-tree';

import { useCatalog } from '../catalog';
import Autocomplete, { TOption } from '@src/components/autocomplete';

function CatalogFilter() {
  const { callbacks, select } = useCatalog();
  const [search, setSearch] = useState('');

  const helpers = {
    optionsBuilder: (search: string) => {
      setSearch(search);
      return select.countries.filter((option: { _id: string; code: string; title: string }) => {
        return [option.code, option.title].some((val) =>
          val.toLowerCase().includes(search.toLowerCase())
        );
      });
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
      []
    ),
    categories: useMemo(
      () => [
        { value: '', title: 'Все' },
        ...treeToList(listToTree(select.categories), (item: TItem, level: number) => ({
          value: item._id,
          title: '- '.repeat(level) + item.title,
        })),
      ],
      [select.categories]
    ),
    countriesDefault: useMemo(() => {
      return [{ _id: '', code: '', title: 'Все' }, ...select.countries];
    }, [select.countries]),
    countriesInAction: useMemo(() => {
      if (!search) return [{ _id: '', code: '', title: 'Все' }, ...select.countries];
      return helpers.optionsBuilder(search);
    }, [search, select.countries]),
  };

  const { t } = useTranslate();

  return (
    <SideLayout padding='medium'>
      <Select
        options={options.categories}
        value={select.category}
        onChange={callbacks.onCategory}
      />
      <Select options={options.sort} value={select.sort} onChange={callbacks.onSort} />
      <Input
        value={select.query}
        onChange={callbacks.onSearch}
        placeholder={'Поиск'}
        delay={1000}
      />

      {/* Выбор страны */}
      <Autocomplete.Root
        value={select.country}
        onSelected={(country) => callbacks.onCountrySelected(country._id)}
        options={options.countriesDefault}
      >
        <Autocomplete.Search onChange={helpers.optionsBuilder} placeholder='Поиск' />
        <Autocomplete.List>
          {options.countriesInAction.map((option: TOption) => (
            <Autocomplete.Option key={option._id} option={option} />
          ))}
        </Autocomplete.List>
      </Autocomplete.Root>
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </SideLayout>
  );
}

export default memo(CatalogFilter);
