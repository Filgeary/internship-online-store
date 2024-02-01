import {memo, useCallback, useEffect, useState, useRef} from "react";
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
  const [chosenProductId, setChosenProductId] = useState(null)

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
    openModal: useCallback((id) => {
      dispatch(modalsActions.open('quantity'))
      setChosenProductId(id)
    }, [store]),
    // Отмена выделения продукта
    cancellation: useCallback((id) => {
        const status = selectRef.current.some(item => item.id === id)

        if(status) {
          store.actions.basket.removeFromSelected(id)
          store.actions.catalog_modal.selectItem(id)
        }
      
    }, [select.selected]),
    // Пагинация
    onPaginate: useCallback(page => store.actions.catalog_modal.setParams({page}), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({page, limit: select.limit, sort: select.sort, query: select.query})}`;
    }, [select.limit, select.sort, select.query])
  }

  const {t} = useTranslate();

  const renders = {
    item: useCallback(item => (
      <Item 
        item={item} 
        onOpenModal={callbacks.openModal} 
        link={`/articles/${item._id}`} 
        labelAdd={t('article.add')}
        deselect={callbacks.cancellation}
        hideLink={false}
        />
    ), [callbacks.openModal, t]),
  };

  useEffect(() => {

    if(select.quantity && chosenProductId) {
        // Добавление товар в выбранные
        store.actions.basket.updateSelected(chosenProductId)
        // Товар отмечен синим фоном
         store.actions.catalog_modal.selectItem(chosenProductId)
    }
  }, [select.quantity])

  useEffect(() => {
    selectRef.current = select.selected;
  }, [select.selected])

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.page} limit={select.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

export default memo(CatalogListModal);