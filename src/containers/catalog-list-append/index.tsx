import { memo, useCallback } from 'react';

import useTranslate from '@src/hooks/use-translate';
import List from '@src/components/list';
import Pagination from '@src/components/pagination';
import Spinner from '@src/components/spinner';
import ItemSelectable from '@src/components/item-selectable';

import { useCatalog } from '../catalog';

type CatalogListAppendProps = {
  onItemClick?: (item: TItem) => void;
  onItemDelete?: (item: TItem) => void;
  countOfItems?: Record<string | number, number>;
  appendixOfItem?: (count: number) => string;
};

const defaultProps: CatalogListAppendProps = {
  countOfItems: {},
  onItemDelete: () => {},
  appendixOfItem: () => '',
};

CatalogListAppend.defaultProps = defaultProps;

function CatalogListAppend(props: CatalogListAppendProps) {
  const { select, callbacks } = useCatalog();

  const { t } = useTranslate();

  const handlers = {
    // Добавить к количеству товара в корзине
    addCountOfItem: useCallback(
      (item: TItem) => {
        props.onItemClick(item);
      },
      [props.onItemClick]
    ),
  };

  const renders = {
    item: useCallback(
      (item: TItem) => (
        <ItemSelectable
          item={item}
          count={props.countOfItems[item._id]}
          onClick={() => handlers.addCountOfItem(item)}
          onDelete={() => props.onItemDelete(item)}
          appendix={props.appendixOfItem}
          link={`/articles/${item._id}`}
          labelDelete={t('article.delete')}
        />
      ),
      [
        props.countOfItems,
        props.countOfItems,
        props.onItemDelete,
        props.appendixOfItem,
        handlers.addCountOfItem,
      ]
    ),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item} />
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

export default memo(CatalogListAppend);
