import { useCallback } from "react";
import useStore from "@src/hooks/use-store";
import { useDispatch } from "react-redux";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import CountItemForm from "@src/components/count-item-form";
import ModalLayout from "@src/components/modal-layout";
import modalsActions from "@src/store-redux/modals/actions";

function CountItemModal() {
  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelector((state) => ({
    activeItem: state.basket.activeItem,
  }));

  const callbacks = {
    // Закрытие любой модалки
    closeModal: useCallback(() => {
      if (select.activeItem.count) {
        store.actions.basket.addToBasket(
          select.activeItem._id,
          select.activeItem.count
        );
        store.actions.basket.resetActiveItem();
      }
      dispatch(modalsActions.close());
    }, [store, select.activeItem]),
    onSubmit: (count) => {
      store.actions.basket.setCount(count);
    },
  };

  const { t } = useTranslate();

  return (
    <ModalLayout
      title={t("count.title")}
      labelClose={t("count.close")}
      onClose={callbacks.closeModal}
    >
      <CountItemForm
        title={select.activeItem.title}
        onSubmit={callbacks.onSubmit}
        labelCount={t("count.count")}
        labelBuy={t("count.buy")}
        labelError={t("count.error")}
        labelSuccess={t("count.success")}
      />
    </ModalLayout>
  );
}

export default CountItemModal;
