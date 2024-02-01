import DialogLayout from "@src/components/dialog-layout";
import NumberInput from "@src/components/number-input";
import useModal from "@src/hooks/use-modal";
import { memo, useCallback, useState } from "react";
import PropTypes from "prop-types";

function AmountDialog(props) {

  const [value, setValue] = useState(1)
  const modal =  useModal()

  const callbacks = {
    cancelBasketDialog: useCallback(() => modal.close(props.id), [modal, props.id]),
    submitBasketDialog: useCallback(() => modal.close(props.id, value), [modal, value, props.id])
  }

  return (
    <DialogLayout title={props.extraData.title || 'Количество'} 
                  labelClose="Отмена" 
                  labelSubmit="Ок"
                  submitDisabled={value == 0}
                  onClose={callbacks.cancelBasketDialog}
                  onSubmit={callbacks.submitBasketDialog}
                  background={props.background}>
      <NumberInput value={value} setValue={setValue} min={0} step={1} max={20}/>
    </DialogLayout>
  )
}

AmountDialog.propTypes = {
  background: PropTypes.bool,
  id: PropTypes.number,
  extraData: PropTypes.shape({
    title: PropTypes.string,
  })
};

AmountDialog.defaultProps = {
  background: false,
  extraData: {
    title: undefined
  }
};

export default memo(AmountDialog)