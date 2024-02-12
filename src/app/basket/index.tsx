import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import ItemBasket from "@src/components/item-basket";
import List from "@src/components/list";
import ModalLayout from "@src/components/modal-layout";
import BasketTotal from "@src/components/basket-total";
import modalsActions from "@src/store-redux/modals/actions";
import { useSelector as useSelectorRedux } from "react-redux";
import useInit from "@src/hooks/use-init";
import { TArticleState } from "@src/store/article/types";
import { TReducer } from "@src/store-redux/modals/reducer";

function Basket() {
  const store = useStore();
  const dispatch = useDispatch();
  const { t } = useTranslate();

  const select = useSelector((state) => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
  }));

  const activeModal = useSelectorRedux(
    (state: { article: TArticleState; modals: TReducer }) => state.modals
  );

  useInit(() => {
    if (Array.isArray(activeModal.data)) {
      store.actions.basket.multiAddToBasket(activeModal.data);
      dispatch(modalsActions.reset());
    }
  }, [activeModal.data]);

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback(
      (_id: any) => store.actions.basket.removeFromBasket(_id),
      [store]
    ),
    // Закрытие модалки корзины
    closeModal: useCallback(() => {
      //store.actions.modals.close();
      dispatch(modalsActions.close("basket", null));
    }, [store]),
    // Открытие модалки добавления еще товаров
    openModal: useCallback(() => {
      dispatch(modalsActions.open("catalog"));
    }, [store]),
  };

  const renders = {
    itemBasket: useCallback(
      (item: any) => (
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
      <BasketTotal sum={select.sum} t={t} open={callbacks.openModal} />
    </ModalLayout>
  );
}

export default memo(Basket);
