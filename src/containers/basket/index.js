import { memo, useCallback } from "react";

import BasketTotal from "@src/components/basket-total";
import ItemBasket from "@src/components/item-basket";
import List from "@src/components/list";
import ModalLayout from "@src/components/modal-layout";
import SideLayout from "@src/components/side-layout";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";

function Basket() {
  const store = useStore();
  const { t } = useTranslate();

  const select = useSelector((state) => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
  }));

  const callbacks = {
    removeFromBasket: useCallback(
      (_id) => store.actions.basket.removeFromBasket(_id),
      [store]
    ),
    closeModal: useCallback(() => {
      store.actions.modals.close("basket");
    }, [store]),
    addToBasket: useCallback(
      async (productIDs) => {
        if (!productIDs.length) return;

        for (const id of productIDs) {
          await store.actions.basket.addToBasket(id, 1);
        }
      },
      [store]
    ),
    openModalCatalog: useCallback(() => {
      store.actions.modals.open("modalCatalog", callbacks.addToBasket);
    }, [store]),
  };

  const renders = {
    itemBasket: useCallback(
      (item) => (
        <ItemBasket
          item={item}
          link={`/articles/${item._id}`}
          onRemove={callbacks.removeFromBasket}
          onLink={callbacks.closeModal}
          labelUnit={t("basket.unit")}
          labelDelete={t("basket.delete")}
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
    >
      <List list={select.list} renderItem={renders.itemBasket} />
      <BasketTotal sum={select.sum} t={t} />

      <SideLayout side="center">
        <button onClick={callbacks.openModalCatalog}>
          {t("basket.selectMoreProducts")}
        </button>
      </SideLayout>
    </ModalLayout>
  );
}

export default memo(Basket);
