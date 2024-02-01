import DialogLayout from "@src/components/dialog-layout";
import NumberInput from "@src/components/number-input";
import { memo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import useStore from "@src/hooks/use-store";

function AmountDialog(props) {

  const [value, setValue] = useState(1)
  const store =  useStore()

  const callbacks = {
    cancelBasketDialog: useCallback(() => store.actions.modals.close(props.id), [store, props.id]),
    submitBasketDialog: useCallback(() => store.actions.modals.close(props.id, value), [store, value, props.id])
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