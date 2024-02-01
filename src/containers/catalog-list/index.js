import {memo, useCallback } from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import { useDispatch } from "react-redux";
import ItemModalCatalog from "@src/components/item-modal-catalog";

function CatalogList({isModal, onAdd, selectedArticles}) {
  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelector(state => ({
    list: state.catalog.list,
    page: state.catalog.params.page,
    limit: state.catalog.params.limit,
    count: state.catalog.count,
    waiting: state.catalog.waiting,
  }));

  const callbacks = {
    // Добавление в корзину
    arcticleCount: useCallback((_id, _title) => {
      store.actions.modals.open("addToBasket", {title: _title, count: 1}).then( result => {
        if(result) {
          store.actions.basket.addToBasket(_id, result)
        }
      });
    }, [store]),
    // Пагинация
    onPaginate: useCallback(page => store.actions.catalog.setParams({page}), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({page, limit: select.limit, sort: select.sort, query: select.query})}`;
    }, [select.limit, select.sort, select.query])
  }

  const {t} = useTranslate();

  const renders = {
    item: useCallback(item => (
      <Item item={item} onAdd={callbacks.arcticleCount} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
    ), [callbacks.arcticleCount, t]),
    modalItem: useCallback(item => (
      <ItemModalCatalog item={item} onAdd={onAdd} selected={selectedArticles.find(id => item._id === id)}/>
    ), [t, onAdd])
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={isModal ? renders.modalItem : renders.item}/>
      <Pagination count={select.count} page={select.page} limit={select.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

export default memo(CatalogList);
