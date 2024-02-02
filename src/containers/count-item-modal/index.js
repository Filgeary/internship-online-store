import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import CountItemForm from "@src/components/count-item-form";
import ModalLayout from "@src/components/modal-layout";
import useModalId from "@src/hooks/use-modalId";

function CountItemModal() {
  const store = useStore();
  const modalId = useModalId();
  
  const callbacks = {
    // Закрытие модалки
    closeModal: () => store.actions.modals.close("count", modalId),
    onSubmit: (count) => {
      store.actions.modals.close("count", modalId, [+count]);
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
