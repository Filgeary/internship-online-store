import Basket from "@src/app/basket";
import CountForm from "@src/components/count-form";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import PropTypes from "prop-types";
import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import modalsActions from "@src/store-redux/modals/actions";

const Modals = ({ activeModal }) => {
  const id = useSelector((state) => state.basket.active);
  const dispatch = useDispatch();
  const store = useStore();

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
        />
      )}
    </>
  );
};

Modals.propTypes = {
  activeModal: PropTypes.string,
};

export default memo(Modals);
