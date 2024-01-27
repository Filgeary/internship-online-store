import DialogLayout from "@src/components/dialog-layout";
import NumberInput from "@src/components/number-input";
import { memo, useCallback, useState } from "react";

function AddToBasketDialog(props) {

  const [value, setValue] = useState(1)

  const callbacks = {
    submitBasketDialog: useCallback(() => props.submitBasketDialog(value), 
    [props.submitBasketDialog, value])
  }

  return (
    <DialogLayout title={'Добавить в корзину'} 
                  labelClose="Отмена" 
                  labelSubmit="Ок"
                  submitDisabled={value == 0}
                  onClose={props.cancelBasketDialog}
                  onSubmit={callbacks.submitBasketDialog}>
      <span>Количество товара</span>
      <NumberInput value={value} setValue={setValue} min={0} step={1} max={20}/>
    </DialogLayout>
  )
}

export default memo(AddToBasketDialog)