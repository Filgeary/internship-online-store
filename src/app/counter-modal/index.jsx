import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import useTranslate from "@src/hooks/use-translate";
import ModalLayout from "@src/components/modal-layout";
import CounterModalForm from "@src/components/counter-modal-form";
import PropTypes from 'prop-types';

function CounterModal({ closeModal }) {
  const options = {
    minInputValue: 1,
    maxInputValue: 99,
  };

  const { t } = useTranslate();

  return (
    <ModalLayout
      title={t("counter-modal.title")}
      labelClose={t("modal.close")}
      onClose={closeModal}
    >
      <CounterModalForm
        minInputValue={options.minInputValue}
        maxInputValue={options.maxInputValue}
        onSubmit={closeModal}
        onCancel={closeModal}
        t={t}
      />
    </ModalLayout>
  );
}

CounterModal.propTypes = {
  closeModal: PropTypes.func
}

CounterModal.defaultProps = {
  closeModal: (result) => {}
}

export default memo(CounterModal);
