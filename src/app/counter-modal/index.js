import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import useTranslate from "@src/hooks/use-translate";
import ModalLayout from "@src/components/modal-layout";
import modalsActions from "@src/store-redux/modals/actions";
import CounterModalForm from "@src/components/counter-modal-form";

function Basket() {
  const dispatch = useDispatch();

  const callbacks = {
    // Закрытие любой модалки
    closeModal: useCallback(() => {
      dispatch(modalsActions.close());
    }, [dispatch]),
    // Отправка результата при закрытии модалки
    sendResult: useCallback((count) => {
      dispatch(modalsActions.close(count));
    }, [dispatch]),
  };

  const options = {
    minInputValue: 1,
    maxInputValue: 99,
  };

  const { t } = useTranslate();

  return (
    <ModalLayout
      title={t("counter-modal.title")}
      labelClose={t("modal.close")}
      onClose={callbacks.closeModal}
    >
      <CounterModalForm
        minInputValue={options.minInputValue}
        maxInputValue={options.maxInputValue}
        onSubmit={callbacks.sendResult}
        onCancel={callbacks.closeModal}
        t={t}
      />
    </ModalLayout>
  );
}

export default memo(Basket);
