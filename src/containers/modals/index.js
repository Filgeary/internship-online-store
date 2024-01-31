import Basket from "@src/app/basket";
import CountForm from "@src/components/count-form";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import modalsActions from "@src/store-redux/modals/actions";
import useTranslate from "@src/hooks/use-translate";
import { useSelector as useSelectorRedux } from "react-redux";
import CatalogModal from "@src/containers/catalog-modal";

const Modals = () => {
  const activeModal = useSelectorRedux((state) => state.modals);
  const id = useSelector((state) => state.basket.active);
  const dispatch = useDispatch();
  const store = useStore();
  const { t } = useTranslate();
  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(
      (id, count) => store.actions.basket.addToBasket(id, count),
      []
    ),

    // Событие формы
    onSubmit: (count) => {
      store.actions.basket.addToArticleCount(count);
      callbacks.addToBasket(id, count);
      callbacks.closeModal();
    },

    // Закрытие модалки
    closeModal: useCallback(() => {
      dispatch(modalsActions.close("articleCount"));
    }, [store]),

    // Закрытие модалки каталога и мультидобавление товара в корзину
    closeModalCatalog: useCallback(
      (data) => {
        store.actions.basket.multiAddToBasket(data);
        dispatch(modalsActions.close("catalog"));
      },
      [store]
    ),
  };

  return (
    <>
      {activeModal.list.map(
        (el, i) =>
          (el === "basket" && <Basket key={i} />) ||
          (el === "articleCount" && (
            <CountForm
              onSubmit={callbacks.onSubmit}
              closeModal={callbacks.closeModal}
              basketUnit={t("basket.unit")}
              title={t("count.form.title")}
              ok={t("count.form.ok")}
              cancel={t("count.form.cancel")}
              key={i}
            />
          )) ||
          (el === "catalog" && (
            <CatalogModal closeModal={callbacks.closeModalCatalog} key={i} />
          ))
      )}
    </>
  );
};

export default memo(Modals);
