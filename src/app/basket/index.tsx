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
import type { ItemType } from '@src/components/item-basket/type';

function Basket() {
  const store = useStore();
  const modalId = useModalId();

  const select = useSelector((state: any) => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
    waiting: state.basket.waiting
  }));

  const options = {
    modalName: "catalogModal",
    storeName: "copyCatalog",
    baseStore: "catalog"
  }

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback((_id: string) => store.actions.basket.removeFromBasket(_id), [store]),
    // Закрытие любой модалки
    closeModal: useCallback(() => {
      store.actions.modals.close(modalId)
    }, [store, modalId]),
    addToBasket: useCallback(async ()=> {
        store.make(options.storeName, options.baseStore);
        store.actions.modals.open(options.modalName).then((selectedItems: string[]) => {
          store.actions.basket.addManyToBasket(selectedItems);
          store.delete(options.storeName);
        });
    }, [store])
  }

  const {t} = useTranslate();

  const renders = {
    itemBasket: useCallback(
      (item: ItemType) => (
        <ItemBasket
          item={item}
          link={`/articles/${item._id}`}
          onRemove={callbacks.removeFromBasket}
          onLink={callbacks.closeModal}
          labelUnit={t("basket.unit")}
          labelDelete={t("basket.delete")}
          labelCurr={"₽"}
        />
      ),
      [callbacks.removeFromBasket, t]
    ),
  };

  return (
    <ModalLayout
      title={t("basket.title")}
      labelClose={t("basket.close")}
      onClose={callbacks.closeModal}
      isClose={true}
    >
      <Spinner active={select.waiting}>
        <List list={select.list} renderItem={renders.itemBasket} />
        <BasketTotal sum={select.sum} labelTotal={t("basket.total")} />
      </Spinner>
      <Controls
        labelChoice={t("basket.choice")}
        onAdd={callbacks.addToBasket}
      />
    </ModalLayout>
  );
}

export default Basket;
