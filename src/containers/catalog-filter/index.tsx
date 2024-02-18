import { memo, useMemo } from 'react';

import useTranslate from '@src/hooks/use-translate';

import Select from '@src/components/select';
import Input from '@src/components/input';
import SideLayout from '@src/components/side-layout';
import treeToList from '@src/utils/tree-to-list';
import listToTree from '@src/utils/list-to-tree';

import { useCatalogContext } from '../catalog';
import CatalogCountry from '../catalog-country';

function CatalogFilter() {
  const { callbacks, select } = useCatalogContext();

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
      <CatalogCountry />
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </SideLayout>
  );
}

export default memo(CatalogFilter);
