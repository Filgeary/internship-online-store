import { useCallback } from "react";
import useStore from "@src/hooks/use-store";
import { useDispatch, useSelector as useSelectorRedux } from "react-redux";
import useTranslate from "@src/hooks/use-translate";
import CountItemForm from "@src/components/count-item-form";
import ModalLayout from "@src/components/modal-layout";
import modalsActions from "@src/store-redux/modals/actions";
import activeActions from "@src/store-redux/count/actions";
import shallowequal from "shallowequal";

function CountItemModal() {
  const store = useStore();
  const dispatch = useDispatch();

  const selectRedux = useSelectorRedux((state) => ({
    activeItem: state.active.activeItem,
  }), shallowequal);

  const callbacks = {
    // Закрытие любой модалки
    closeModal: useCallback(() => {
      if (selectRedux.activeItem.count) {
        store.actions.basket.addToBasket(
          selectRedux.activeItem._id,
          selectRedux.activeItem.count
        );
        dispatch(activeActions.reset());
      }
      dispatch(modalsActions.close());
    }, [store, selectRedux.activeItem]),
    onSubmit: (count) => {
      dispatch(activeActions.setCount(+count));
    },
  };

  const { t } = useTranslate();
  const labelCount = t("count.count").replace(
    "[product]",
    selectRedux.activeItem.title
  );

  return (
    <ModalLayout
      title={t("count.title")}
      labelClose={t("count.close")}
      onClose={callbacks.closeModal}
    >
      <CountItemForm
        title={selectRedux.activeItem.title}
        onSubmit={callbacks.onSubmit}
        labelCount={labelCount}
        labelSuccess={t("count.success")}
      />
    </ModalLayout>
  );
}

export default CountItemModal;
