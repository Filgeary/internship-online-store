import {memo, useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import { useDispatch } from "react-redux";
import modalsActions from '@src/store-redux/modals/actions';
import useWaitModal from "@src/hooks/use-wait-modal";

function CatalogList() {
  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelector(state => ({
    list: state.catalog.list,
    page: state.catalog.params.page,
    limit: state.catalog.params.limit,
    count: state.catalog.count,
    waiting: state.catalog.waiting,
  }));

  useWaitModal("counter-modal", async (result) => {
    if (result > 0) {
      await store.actions.basket.addActiveItem(result);
    }
    store.actions.catalog.setWaiting(false);
  }, [store]);

  const callbacks = {
    // Добавление в корзину
    // addToBasket: useCallback((_id, number) => store.actions.basket.addToBasket(_id, number), [store]),
    // Пагинация
    onPaginate: useCallback(page => store.actions.catalog.setParams({page}), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({page, limit: select.limit, sort: select.sort, query: select.query})}`;
    }, [select.limit, select.sort, select.query]),
    // Добавление в корзину c вызовом Модалки для ввода количества
    addToBasket: useCallback((_id) => {
      if (!select.waiting) {
        store.actions.basket.setActiveItemId(_id);
        store.actions.catalog.setWaiting(true);
        dispatch(modalsActions.open("counter-modal"));
      }
    }, [store, dispatch, select.waiting])
  }

  const {t} = useTranslate();

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

export default memo(CatalogList);
