import { memo, useCallback } from 'react';

import Item from '@src/components/item';
import ItemModalCatalog from '@src/components/item-modal-catalog';
import List from '@src/components/list';
import Pagination from '@src/components/pagination';
import Spinner from '@src/components/spinner';
import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';

import type { IArticle } from '@src/types/IArticle';

type Props = {
  isSelectionMode?: boolean;
  onSelectItem?: (id: string, checked: boolean) => void;
  selectedItems?: string[];
  catalogSliceName?: 'catalog' | `catalog${number}`;
};

function CatalogList({
  isSelectionMode,
  onSelectItem,
  selectedItems,
  catalogSliceName = 'catalog',
}: Props) {
  const store = useStore();
  const { t } = useTranslate();

  const select = useSelector(state => ({
    list: state[catalogSliceName].list,
    page: state[catalogSliceName].params.page,
    limit: state[catalogSliceName].params.limit,
    sort: state[catalogSliceName].params.sort,
    query: state[catalogSliceName].params.query,
    count: state[catalogSliceName].count,
    waiting: state[catalogSliceName].waiting,
  }));

  const callbacks = {
    addToBasket: useCallback(
      (_id: string, amount: number) => {
        store.actions.basket.addToBasket(_id, amount);
      },
      [store],
    ),
    onPaginate: useCallback(
      (page: string | number) => store.actions[catalogSliceName].setParams({ page }),
      [catalogSliceName, store],
    ),
    makePaginatorLink: useCallback(
      (page: string) => {
        return `?${new URLSearchParams({
          page,
          limit: String(select.limit),
          sort: select.sort,
          query: select.query,
        })}`;
      },
      [select.limit, select.sort, select.query],
    ),
  };

  const openDialogAmount = useCallback(
    (_id: string | number) => {
      store.actions.modals.open('dialogAmount', callbacks.addToBasket.bind(null, String(_id)));
    },
    [callbacks.addToBasket, store],
  );

  const renders = {
    item: useCallback(
      (item: IArticle) => (
        <Item
          item={item}
          onAdd={openDialogAmount}
          link={`/articles/${item._id}`}
          labelAdd={t('article.add')}
        />
      ),
      [openDialogAmount, t],
    ),
    itemModalCatalog: useCallback(
      (item: IArticle) => (
        <ItemModalCatalog
          item={item}
          onAdd={openDialogAmount}
          onSelectItem={onSelectItem ?? (() => {})}
          isSelected={Boolean(selectedItems?.includes(item._id))}
          labelAdd={t('article.add')}
        />
      ),
      [openDialogAmount, t, onSelectItem, selectedItems],
    ),
  };

  return (
    <Spinner active={select.waiting}>
      <List
        list={select.list}
        renderItem={isSelectionMode ? renders.itemModalCatalog : renders.item}
      />
      <Pagination
        count={select.count}
        page={select.page}
        limit={select.limit}
        onChange={callbacks.onPaginate}
        makeLink={callbacks.makePaginatorLink}
      />
    </Spinner>
  );
}

export default memo(CatalogList);
