import { memo, useCallback, useRef } from "react";
import {
  useDispatch,
  useStore as useStoreRedux,
  useSelector as useSelectorRedux,
} from "react-redux";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useInit from "@src/hooks/use-init";
import useTranslate from "@src/hooks/use-translate";
import ItemBasket from "@src/components/item-basket";
import List from "@src/components/list";
import ModalLayout from "@src/components/modal-layout";
import BasketTotal from "@src/components/basket-total";
import modalsActions from "@src/store-redux/modals/actions";

function Basket({ onTop, id }) {
  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelector((state) => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
  }));

  const promiseRef = useRef();

  useSelectorRedux((state) => {
    promiseRef.current = state.modals.activeModals.find(
      (el) => el.id === id
    )?.promise;
  });

  const callbacks = {
    openCatalogListModal: useCallback(() => {
      dispatch(modalsActions.open("catalog-list-modal"));
      promiseRef.current?.then(async (items) => {
        for (const i in items) {
          console.log(items[i], "item");
          await store.actions.basket.addToBasket(items[i], 1);
        }
        // items.forEach((item) => {
        //   store.actions.basket.addToBasket(item, 1);
        // });
        dispatch(modalsActions.close(id));
      });
    }, [store]),
    // Удаление из корзины
    removeFromBasket: useCallback(
      (_id) => store.actions.basket.removeFromBasket(_id),
      [store]
    ),
    // Закрытие любой модалки
    closeModal: useCallback(() => {
      //store.actions.modals.close();
      dispatch(modalsActions.close(id));
    }, [store]),
  };

  const { t } = useTranslate();

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
      onTop={onTop}
    >
      <List list={select.list} renderItem={renders.itemBasket} />
      <BasketTotal sum={select.sum} t={t} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button onClick={callbacks.openCatalogListModal}>
          Выбрать ещё товар
        </button>
      </div>
    </ModalLayout>
  );
}

export default memo(Basket);
