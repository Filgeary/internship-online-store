import CountForm from "@src/components/count-form";
import ModalLayout from "@src/components/modal-layout";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";

const CountModal = (props) => {
  const { t } = useTranslate();
  const store = useStore();

  const callbacks = {
    // Закрытие модалки каталога
    closeModal: (count) => {
      props.closeModal("counter", count);
    },
    // Событие формы
    onSubmit: useCallback(
      (count) => {
        callbacks.closeModal(count);
      },
      [store]
    ),
  };

  return (
    <ModalLayout
      title={t("count.counter")}
      labelClose={t("count.form.cancel")}
      onClose={callbacks.closeModal}
    >
      <CountForm
        basketUnit={t("basket.unit")}
        title={t("count.form.title")}
        ok={t("count.form.ok")}
        cancel={t("count.form.cancel")}
        onSubmit={callbacks.onSubmit}
        closeModal={callbacks.closeModal}
      />
    </ModalLayout>
  );
};

CountModal.propTypes = {
  closeModal: PropTypes.func,
};

CountModal.defaultProps = {
  closeModal: () => {},
};

export default memo(CountModal);
