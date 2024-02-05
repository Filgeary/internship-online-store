import {memo, useCallback, useEffect} from 'react';
import {useDispatch, useStore as useStoreRedux} from 'react-redux';
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import {useSelector as useSelectorRedux} from 'react-redux';
import useInit from "@src/hooks/use-init";
import useTranslate from "@src/hooks/use-translate";
import ItemBasket from "@src/components/item-basket";
import List from "@src/components/list";
import ModalLayout from "@src/components/modal-layout";
import BasketTotal from "@src/components/basket-total";
import modalsActions from '@src/store-redux/modals/actions';
import Button from '@src/components/button'
import codeGenerator from "@src/utils/code-generator"
import generateUniqueId from "@src/utils/unicque_id"
import closeId from '@src/utils/closeId';


function Basket() {

  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelector(state => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
    selected: state.basket.selected
  }));

  const statusCatalogModal = useSelectorRedux(state => state.modals.statusCatalogModal);
  const stateModal = useSelectorRedux(state => state.modals.modals)

  const id = generateUniqueId()

  // function closeId(modals, name) {
  //   const modal = modals.filter((item) => item.name === name)
  //   return modal.id
  // }

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback(_id => store.actions.basket.removeFromBasket(_id), [store]),
    // Закрытие модалки
    closeModal: useCallback(() => {
      // dispatch(modalsActions.closeModal('basket', id))
      dispatch(modalsActions.closeModal(closeId(stateModal, 'basket')))
    }, [store]),
    // Открытие модалки для выбра товаров
    openModal: useCallback(() => {
      // dispatch(modalsActions.open('goods', id))
      dispatch(modalsActions.open({name: 'goods', id: id}))
    }, [store]),
  }

  const {t} = useTranslate();

  const renders = {
    itemBasket: useCallback((item) => (
      <ItemBasket item={item}
                  link={`/articles/${item._id}`}
                  onRemove={callbacks.removeFromBasket}
                  onLink={callbacks.closeModal}
                  labelUnit={t('basket.unit')}
                  labelDelete={t('basket.delete')}
      />
    ), [callbacks.removeFromBasket, t]),
  };
  console.log('statusCatalogModal', statusCatalogModal)
  useEffect(() => {
    if(statusCatalogModal) {
      console.log('сработал useEffect и statusCatalogModal ===', statusCatalogModal)
      // Добавление выбранных товаров из модального окна
       store.actions.basket.addingSelectedProducts()
    }
  // Очистка статуса закрытия модалки с выбранными товарами
  dispatch(modalsActions.changeStatusCatalogModal(null))
  }, [statusCatalogModal])

  return (
    <ModalLayout title={t('basket.title')} labelClose={t('basket.close')}
                 onClose={callbacks.closeModal}>
      <List list={select.list} renderItem={renders.itemBasket}/>
      <BasketTotal sum={select.sum} t={t}/>
      <Button value='Выбрать ещё товар' onClick={callbacks.openModal}/>
    </ModalLayout>
  );
}

export default memo(Basket);
