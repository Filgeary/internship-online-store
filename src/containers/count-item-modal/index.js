import { useDispatch } from "react-redux";
import useTranslate from "@src/hooks/use-translate";
import CountItemForm from "@src/components/count-item-form";
import ModalLayout from "@src/components/modal-layout";
import modalsActions from "@src/store-redux/modals/actions";
import activeActions from "@src/store-redux/count/actions";

function CountItemModal() {
  const dispatch = useDispatch();

  const callbacks = {
    // Закрытие любой модалки
    closeModal: () => dispatch(modalsActions.close()),
    onSubmit: (count) => {
      dispatch(activeActions.setCount(+count));
      dispatch(modalsActions.close());
    },
  };

  const { t } = useTranslate();

  return (
    <ModalLayout title={t("count.title")} isClose={false}>
      <CountItemForm
        onSubmit={callbacks.onSubmit}
        labelCount={t("count.count")}
        labelCancel={t("count.cancel")}
        onCancel={callbacks.closeModal}
      />
    </ModalLayout>
  );
}

export default CountItemModal;
