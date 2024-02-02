import {useCallback} from 'react';
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import ItemBasket from "@src/components/item-basket";
import List from "@src/components/list";
import ModalLayout from "@src/components/modal-layout";
import BasketTotal from "@src/components/basket-total";
import Controls from '@src/components/controls';
import Spinner from '@src/components/spinner';
import useModalId from '@src/hooks/use-modalId';

function Basket() {
  const store = useStore();
  const modalId = useModalId();

  const select = useSelector(state => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
    waiting: state.basket.waiting
  }));

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback(_id => store.actions.basket.removeFromBasket(_id), [store]),
    // Закрытие любой модалки
    closeModal: useCallback(() => {
      store.actions.modals.close("basket", modalId);
    }, [store]),
    addToBasket: useCallback(async ()=> {
        store.actions.catalogModal.setIsModal(true);
        store.actions.modals
          .open("catalog")
          .then((selectedItems) =>
            store.actions.basket.addManyToBasket(selectedItems)
          );
    }, [store])
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
                 onClose={callbacks.closeModal} isClose={true}>
      <Spinner active={select.waiting}>
        <List list={select.list} renderItem={renders.itemBasket}/>
        <BasketTotal sum={select.sum} t={t}/>
      </Spinner>
      <Controls labelChoice={t('basket.choice')} onAdd={callbacks.addToBasket}/>
    </ModalLayout>
  );
}

export default Basket;
