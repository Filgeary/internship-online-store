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
import BasketControls from '@src/components/basket-controls';
import addManyProductsActions from '@src/store-redux/add-many-products/actions';

function Basket(props) {

  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelector(state => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
  }));

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback(_id => store.actions.basket.removeFromBasket(_id), [store]),
    // Закрытие любой модалки
    closeModal: useCallback(() => {
      //store.actions.modals.close();
      dispatch(modalsActions.close());
    }, [store]),

    // Добавить ещё товаров
    addMoreToBasket: useCallback(_id => {
      // Открываем диалоговое окно и передаём ему колбэк на случай успеха
      dispatch(dialogsActions.open(props.context, result => {
        // Обработка в случае успеха (добавим в корзину, корзина умеет принимать массив)
        store.actions.basket.addToBasket(result)
      }));
      dispatch(addManyProductsActions.open()); // сбросить данные и установить `waiting=true`
    }, [props.context, store]),
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
    >
      <List list={select.list} renderItem={renders.itemBasket}/>
      <BasketTotal sum={select.sum} t={t} />
      <BasketControls
        onAddMore={callbacks.addMoreToBasket}
        sum={select.sum}
      />
    </ModalLayout>
  );
}

export default memo(Basket);
