import DialogLayout from "@src/components/dialog-layout";
import NumberInput from "@src/components/number-input";
import useModal from "@src/hooks/use-modal";
import { memo, useCallback, useState } from "react";

function AddToBasketDialog() {

  const [value, setValue] = useState(1)
  const modal =  useModal()

  const callbacks = {
    cancelBasketDialog: useCallback(() => modal.close(), [modal]),
    submitBasketDialog: useCallback(() => modal.close(value), [modal, value])
  }

  return (
    <DialogLayout title={'Добавить в корзину'} 
                  labelClose="Отмена" 
                  labelSubmit="Ок"
                  submitDisabled={value == 0}
                  onClose={callbacks.cancelBasketDialog}
                  onSubmit={callbacks.submitBasketDialog}>
      <NumberInput value={value} setValue={setValue} min={0} step={1} max={20}/>
    </DialogLayout>
  )
}

export default memo(AddToBasketDialog)