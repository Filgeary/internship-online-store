import {memo, useCallback} from 'react';
import {useDispatch, useStore as useStoreRedux} from 'react-redux';
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useInit from "@src/hooks/use-init";
import useTranslate from "@src/hooks/use-translate";
import ItemBasket from "@src/components/item-basket";
import List from "@src/components/list";
import ModalLayout from "@src/components/modal-layout";
import BasketTotal from "@src/components/basket-total";
import modalsActions from '@src/store-redux/modals/actions';
import dialogsActions from '@src/store-redux/dialogs/actions';

function Basket() {

  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelector(state => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum
  }));

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback(_id => store.actions.basket.removeFromBasket(_id), [store]),
    // Закрытие любой модалки
    closeModal: useCallback(() => {
      //store.actions.modals.close();
      dispatch(modalsActions.close());
    }, [store]),

    // Тестовый диалог
    // TODO: удалить потом
    openTestDialog: useCallback(_id => {
      dispatch(dialogsActions.open({
        name: 'test-dialog',
        title: 'Ещё один диалог',
        _id: '12k1e21k4l+++',
        content: {},
      }))
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

  return (
    <ModalLayout title={t('basket.title')} labelClose={t('basket.close')}
      onClose={callbacks.closeModal}
      // Для открытия тестового диалога.
      // TODO:удалить потом
      openTestDialog={callbacks.openTestDialog}
    >
      <List list={select.list} renderItem={renders.itemBasket}/>
      <BasketTotal sum={select.sum} t={t}/>
    </ModalLayout>
  );
}

export default memo(Basket);
