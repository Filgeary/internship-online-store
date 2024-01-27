import Basket from "@src/app/basket";
import CountForm from "@src/components/count-form";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import modalsActions from "@src/store-redux/modals/actions";
import useTranslate from "@src/hooks/use-translate";
import { useSelector as useSelectorRedux } from "react-redux";

const Modals = () => {
  const activeModal = useSelectorRedux((state) => state.modals.name);
  const id = useSelector((state) => state.basket.active);
  const dispatch = useDispatch();
  const store = useStore();
  const { t } = useTranslate();
  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(
      (id, count) => store.actions.basket.addToBasket(id, count),
      [store]
    ),

    // Событие формы
    onSubmit: (count) => {
      store.actions.basket.addToArticleCount(count);
      callbacks.addToBasket(id, count);
      callbacks.closeModal();
    },

    // Закрытие модалки
    closeModal: useCallback(() => {
      dispatch(modalsActions.close());
    }, [store]),
  };
  return (
    <>
      {activeModal === "basket" && <Basket />}
      {activeModal === "articleCount" && (
        <CountForm
          onSubmit={callbacks.onSubmit}
          closeModal={callbacks.closeModal}
          basketUnit={t("basket.unit")}
          title={t("count.form.title")}
          ok={t("count.form.ok")}
          cancel={t("count.form.cancel")}
        />
      )}
    </>
  );
};

export default memo(Modals);
