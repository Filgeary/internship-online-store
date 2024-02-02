import { memo, useCallback } from "react";

import PropTypes from 'prop-types';

import useTranslate from "@src/hooks/use-translate";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import ItemSelectable from "@src/components/item-selectable";

import { useCatalog } from "../catalog";

function CatalogListAppend(props) {
  const { select, callbacks } = useCatalog();

  const {t} = useTranslate();

  const handlers = {
    // Добавить к количеству товара в корзине
    addCountOfItem: useCallback((item) => {
      props.onItemClick(item);
    }, [props.onItemClick]),
  };

  const renders = {
    item: useCallback((item) => (
        <ItemSelectable
          item={item}
          count={props.countOfItems[item._id]}
          onClick={() => handlers.addCountOfItem(item)}
          onDelete={() => props.onItemDelete(item)}
          appendix={props.appendixOfItem}
          link={`/articles/${item._id}`}
          labelDelete={t('article.delete')}
        />
      ), [props.countOfItems, props.countOfItems, props.onItemDelete, props.appendixOfItem, handlers.addCountOfItem]),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
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

CatalogListAppend.propTypes = {
  onItemClick: PropTypes.func,
  onItemDelete: PropTypes.func,
  countOfItems: PropTypes.object,
  appendixOfItem: PropTypes.func,
};

CatalogListAppend.defaultProps = {
  countOfItems: {},
  onItemDelete: () => {},
  appendixOfItem: () => {},
};

export default memo(CatalogListAppend);
