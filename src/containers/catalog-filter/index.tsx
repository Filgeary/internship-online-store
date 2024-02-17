import { memo, useMemo } from 'react';

import useTranslate from '@src/hooks/use-translate';

import Select from '@src/components/select';
import Input from '@src/components/input';
import SideLayout from '@src/components/side-layout';
import treeToList from '@src/utils/tree-to-list';
import listToTree from '@src/utils/list-to-tree';

import { useCatalog } from '../catalog';
import SelectCustom from '@src/components/select-custom';

function CatalogFilter() {
  const { callbacks, select } = useCatalog();

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
  };

  const helpers = {
    optionsBuilder: (search: string) => {
      return select.countries.filter((option: { _id: string; code: string; title: string }) => {
        return [option.code, option.title].some((val) =>
          val.toLowerCase().includes(search.toLowerCase())
        );
      });
    },
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
      <SelectCustom
        placeholder='Все'
        value={select.country}
        onSelected={(country) => callbacks.onCountrySelected(country._id)}
        displayStringForOption={(item) => item.title}
        options={select.countries}
        optionsBuilder={helpers.optionsBuilder}
      />
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </SideLayout>
  );
}

export default memo(CatalogFilter);
