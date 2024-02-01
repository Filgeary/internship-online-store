import {memo, useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item-catalog-modal";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import { useDispatch } from "react-redux";
import modalsActions from '@src/store-redux/modals/actions';
import useWaitModal from "@src/hooks/use-wait-modal";

function CatalogModalList( ) {
  const store = useStore();

  const select = useSelector(state => ({
    list: state.catalogModal.list,
    page: state.catalogModal.params.page,
    limit: state.catalogModal.params.limit,
    count: state.catalogModal.count,
    waiting: state.catalogModal.waiting,
  }));

  const callbacks = {
    // Добавление в корзину
    // addToBasket: useCallback((_id, number) => store.actions.basket.addToBasket(_id, number), [store]),
    // Пагинация
    onPaginate: useCallback(page => store.actions.catalogModal.setParams({page}), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({page, limit: select.limit, sort: select.sort, query: select.query})}`;
    }, [select.limit, select.sort, select.query]),
    // Добавление в корзину c вызовом Модалки для ввода количества
    onSelectItem: useCallback((_id) => {
        store.actions.catalogModal.selectItem(_id);
    }, [store])
  }

  const {t} = useTranslate();

  const renders = {
    item: useCallback(item => (
      <Item item={item} onSelect={callbacks.onSelectItem}/>
    ), [callbacks.onSelectItem, t]),
  };

  console.log("render");

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.page} limit={select.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

export default memo(CatalogModalList);
