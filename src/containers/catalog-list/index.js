import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";

import PropTypes from 'prop-types';

import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";

import modalsActions from '@src/store-redux/modals/actions';

function CatalogList(props) {
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
    }, [store, select.list]),
    // Добавить к количеству товара в корзине
    addCountOfItem: useCallback((item) => {
      if (!props.isItemsSelectable) return;
      props.onItemClick(item);
    }, [props.onItemClick]),
  };

  const {t} = useTranslate();

  console.log('@@@', props.countOfItems);

  const renders = {
    item: useCallback(item => (
        <Item
          disabledAddBtn={item._id === select.activeItemBasket?._id}
          item={item}
          count={props.countOfItems[item._id]}
          isSelectable={props.isItemsSelectable}
          onAdd={() => callbacks.openModalOfCount(item)}
          onClick={() => callbacks.addCountOfItem(item)}
          link={`/articles/${item._id}`}
          labelAdd={t('article.add')}
        />
      ), [props.countOfItems, select.activeItemBasket, callbacks.openModalOfCount, t]),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.page} limit={select.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

CatalogList.propTypes = {
  onItemClick: PropTypes.func,
  isItemsSelectable: PropTypes.bool,
  countOfItems: PropTypes.object,
};

CatalogList.defaultProps = {
  isItemsSelectable: false,
  countOfItems: {},
};

export default memo(CatalogList);
