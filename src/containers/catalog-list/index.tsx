import { memo, useCallback } from 'react';

import useTranslate from '@src/hooks/use-translate';
import Item from '@src/components/item';
import List from '@src/components/list';
import Pagination from '@src/components/pagination';
import Spinner from '@src/components/spinner';

import { useCatalogContext } from '../catalog';
import { TCatalogArticle } from '@src/store/catalog/types';

function CatalogList() {
  const { select, callbacks } = useCatalogContext();

  const { t } = useTranslate();

  const renders = {
    item: useCallback(
      (item: TCatalogArticle) => (
        <Item
          item={item}
          onAdd={() => callbacks.openModalOfCount(item)}
          link={`/articles/${item._id}`}
          labelAdd={t('article.add')}
          isBtnDisabled={select.activeItemBasket?._id === item._id}
        />
      ),
      [select.activeItemBasket?._id, callbacks.openModalOfCount, t]
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

export default memo(CatalogList);
