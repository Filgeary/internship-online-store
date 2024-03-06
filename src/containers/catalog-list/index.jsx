import {memo, useCallback, useEffect, useState, useRef} from "react"
import useStore from "@src/hooks/use-store"
import useSelector from "@src/hooks/use-selector"
import useTranslate from "@src/hooks/use-translate"
import Item from "@src/components/item"
import List from "@src/components/list"
import Pagination from "@src/components/pagination"
import Spinner from "@src/components/spinner"
import modalsActions from '@src/store-redux/modals/actions'
import generateUniqueId from "@src/utils/unicque_id"
import { useDispatch } from "react-redux"

function CatalogList({stateName}) {
  const store = useStore();
  const dispatch = useDispatch();
  const selectRef = useRef();
  const [chosenProductId, setChosenProductId] = useState(null)

  const select = useSelector((state) => ({
    list: state[stateName].list,
    page: state[stateName].params.page,
    limit: state[stateName].params.limit,
    count: state[stateName].count,
    waiting: state[stateName].waiting,
    quantity: state.basket.quantity,
    selected: state.basket.selected
  }));

  const idModal = generateUniqueId()

  const callbacks = {
    // Открытие модалки
    openModal: useCallback((id) => {
      // dispatch(modalsActions.open('quantity'))
      dispatch(modalsActions.open({name: 'quantity', id: idModal}))
      dispatch(modalsActions.changeActiveModal(true))
      setChosenProductId(id)
    }, [store]),
    // Добавление в корзину
    addToBasket: useCallback((_id, quantity) => {
      store.actions.basket.addToBasket(_id, quantity)
    }, [store]),
    // Пагинация
    onPaginate: useCallback(page => store.actions[stateName].setParams({page}, false, false, selectRef.current), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({page, limit: select.limit, sort: select.sort, query: select.query})}`;
    }, [select.limit, select.sort, select.query]),
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
      
    }, [select.selected])
  }

  const {t} = useTranslate()

  useEffect(() => {
    if(select.quantity && chosenProductId) callbacks.addToBasket(chosenProductId, select.quantity)
  }, [select.quantity])

  useEffect(() => {
    if(stateName === 'catalog_modal') selectRef.current = select.selected
  }, [select.selected])

  const renders = {
    item: useCallback(item => (
      <Item 
        item={item} 
        onOpenModal={callbacks.openModal} 
        link={`/articles/${item._id}`} 
        labelAdd={t('article.add')}
        disabled={stateName === 'catalog_modal' ? 'disabled' : ''}
        handleClickButton={stateName === 'catalog_modal' ? callbacks.changeSelected : () => {}}
        hideLink={stateName === 'catalog_modal' ? false : true}
        />
    ), [callbacks.openModal, t, callbacks.changeSelected]),
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
