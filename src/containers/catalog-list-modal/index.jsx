import {memo, useCallback, useEffect, useState, useRef, useMemo} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import modalsActions from '@src/store-redux/modals/actions';
import { useDispatch } from "react-redux";

function CatalogListModal() {
  const store = useStore();
  const dispatch = useDispatch();
  const selectRef = useRef();
  // const [chosenProductId, setChosenProductId] = useState(null)

  const select = useSelector(state => ({
    list: state.catalog_modal.list,
    page: state.catalog_modal.params.page,
    limit: state.catalog_modal.params.limit,
    count: state.catalog_modal.count,
    waiting: state.catalog_modal.waiting,
    quantity: state.basket.quantity,
    selected: state.basket.selected
  }));
  
  const callbacks = {
    // Открытие модалки
    // openModal: useCallback((id) => {
    //   dispatch(modalsActions.open('quantity'))
    //   setChosenProductId(id)
    // }, [store]),
    // Выделения продукта
    changeSelected: useCallback((id) => {

      const status = selectRef.current.some(item => item.id === id)

      if(status) {
        store.actions.basket.removeFromSelected(id)
        store.actions.catalog_modal.selectItem(id)
      } else {
        store.actions.basket.updateQuantityProduct(1)
        store.actions.basket.updateSelected(id)
        store.actions.catalog_modal.selectItem(id)
      }
      
    }, [select.selected]),
    // Пагинация
    onPaginate: useCallback(page => store.actions.catalog_modal.setParams({page}, false, false, selectRef.current), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({page, limit: select.limit, sort: select.sort, query: select.query})}`;
    }, [select.limit, select.sort, select.query])
  }

  const {t} = useTranslate();

  useEffect(() => {
    selectRef.current = select.selected;
  }, [select.selected])

  const renders = {
    item: useCallback(item => {
      return (
      <Item 
        disabled='disabled'
        item={item} 
        // onOpenModal={callbacks.openModal} 
        link={`/articles/${item._id}`} 
        labelAdd={t('article.add')}
        handleClickButton={callbacks.changeSelected}
        hideLink={false}
        />
    )}, [callbacks.openModal, t, callbacks.cancellation]),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.page} limit={select.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

export default memo(CatalogListModal);