import {memo, useCallback, useEffect} from "react";
import { useDispatch, useSelector as useSelectorRedux } from "react-redux";

import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";

import modalsActions from '@src/store-redux/modals/actions';

function CatalogList() {
  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelector(state => ({
    list: state.catalog.list,
    page: state.catalog.params.page,
    limit: state.catalog.params.limit,
    count: state.catalog.count,
    waiting: state.catalog.waiting,

    activeItemBasket: state.basket.active,
  }));

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(_id => store.actions.basket.addToBasket(_id), [store]),
    // Пагинация
    onPaginate: useCallback(page => store.actions.catalog.setParams({page}), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({page, limit: select.limit, sort: select.sort, query: select.query})}`;
    }, [select.limit, select.sort, select.query]),
    // Открыть модалку с выбором количества товара для добавления
    openModalOfCount: useCallback((item) => {
      store.actions.basket.setActive(item);
      dispatch(modalsActions.open('countToAdd'));
    }, [select.list]),
  };

  const {t} = useTranslate();

  const renders = {
    item: useCallback(item => (
        <Item
          disabledAddBtn={item._id === select.activeItemBasket?._id}
          item={item}
          onAdd={callbacks.openModalOfCount}
          link={`/articles/${item._id}`}
          labelAdd={t('article.add')}
        />
      ), [select.activeItemBasket, callbacks.addToBasket, callbacks.openModalOfCount, t]),
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
