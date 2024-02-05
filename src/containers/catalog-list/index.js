import PropTypes from "prop-types";
import { memo, useCallback } from "react";

import Item from "@src/components/item";
import ItemModalCatalog from "@src/components/item-modal-catalog";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";

function CatalogList({
  isSelectionMode,
  onSelectItem,
  selectedItems,
  catalogSliceName = "catalog",
}) {
  const store = useStore();
  const { t } = useTranslate();

  const select = useSelector((state) => ({
    list: state[catalogSliceName].list,
    page: state[catalogSliceName].params.page,
    limit: state[catalogSliceName].params.limit,
    count: state[catalogSliceName].count,
    waiting: state[catalogSliceName].waiting,
  }));

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(
      (_id, amount) => {
        store.actions.basket.addToBasket(_id, amount);
      },
      [store]
    ),
    // Пагинация
    onPaginate: useCallback(
      (page) => store.actions[catalogSliceName].setParams({ page }),
      [store]
    ),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback(
      (page) => {
        return `?${new URLSearchParams({
          page,
          limit: select.limit,
          sort: select.sort,
          query: select.query,
        })}`;
      },
      [select.limit, select.sort, select.query]
    ),
  };

  const openDialogAmount = useCallback(
    (_id) => {
      store.actions.modals.open(
        "dialogAmount",
        callbacks.addToBasket.bind(null, _id)
      );
    },
    [store]
  );

  const renders = {
    item: useCallback(
      (item) => (
        <Item
          item={item}
          onAdd={openDialogAmount}
          link={`/articles/${item._id}`}
          labelAdd={t("article.add")}
        />
      ),
      [openDialogAmount, t]
    ),
    itemModalCatalog: useCallback(
      (item) => (
        <ItemModalCatalog
          item={item}
          onAdd={openDialogAmount}
          onSelectItem={onSelectItem}
          isSelected={selectedItems.includes(item._id)}
          labelAdd={t("article.add")}
        />
      ),
      [openDialogAmount, t, onSelectItem, selectedItems]
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

CatalogList.propTypes = {
  isSelectionMode: PropTypes.bool,
  onSelectItem: PropTypes.func,
  selectedItems: PropTypes.array,
};

CatalogList.defaultProps = {
  isSelectionMode: false,
  onSelectItem: () => {},
  selectedItems: [],
};

export default memo(CatalogList);
