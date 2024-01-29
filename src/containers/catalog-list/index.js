import {memo, useCallback, useEffect, useState} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import {useDispatch} from "react-redux";
import modalsActions from "@src/store-redux/modals/actions";
import ModalLayout from "@src/components/modal-layout";
import {useSelector as useSelectorRedux} from "react-redux/es/hooks/useSelector";
import ModalAddBasket from "@src/components/modal-add-basket";
import articleActions from "@src/store-redux/article/actions";

function CatalogList(callback, deps) {
  const store = useStore();
  const dispatch = useDispatch()

  const {t} = useTranslate();

  const select = useSelector(state => ({
    list: state.catalog.list,
    page: state.catalog.params.page,
    limit: state.catalog.params.limit,
    count: state.catalog.count,
    waiting: state.catalog.waiting,
  }));

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback( item => {
      dispatch(modalsActions.open(`adding`, {
        _id: item._id,
        title: item.title,
        price: item.price,
        handleSubmit: callbacks.handleSubmit,
      }));
    }, []),
    // Закрытие модалки
    onClose: useCallback(() => {
      dispatch(modalsActions.close())
    }, []),
    // Добавление товара в корзину
    handleSubmit: useCallback((_id, quantity) => {
      if(quantity > 0) {
        store.actions.basket.addToBasket(_id, quantity)
        dispatch(modalsActions.close())
      } else {
        alert('Введите число больше нуля')
      }
    }, []),
    // Пагинация
    onPaginate: useCallback(page => store.actions.catalog.setParams({page}), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({page, limit: select.limit, sort: select.sort, query: select.query})}`;
    }, [select.limit, select.sort, select.query])
  }


  const renders = {
    item: useCallback(item => (
      <Item item={item} onAdd={callbacks.addToBasket} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
    ), [callbacks.addToBasket, t]),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.page} limit={select.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

export default  memo(CatalogList);
