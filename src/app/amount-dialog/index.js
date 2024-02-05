import DialogLayout from "@src/components/dialog-layout";
import NumberInput from "@src/components/number-input";
import { memo, useCallback, useLayoutEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";

function AmountDialog(props) {

  const [title, setTitle] = useState('Загрузка...')
  const [value, setValue] = useState(1)
  const store =  useStore()
  const {t, lang} = useTranslate()

  const callbacks = {
    cancelBasketDialog: useCallback(() => store.actions.modals.close(props.id), [store, props.id]),
    submitBasketDialog: useCallback(() => store.actions.modals.close(props.id, value), [store, value, props.id])
  }

  useLayoutEffect(() => {
    (async () => {
      const title = await props.extraData?.getTitle()
      setTitle(title || t('amount-dialog.amount'))
    })()
    [lang]
  })

  return (
    <DialogLayout title={title} 
                  labelClose={t('amount-dialog.cancel')} 
                  labelSubmit={t('amount-dialog.ok')}
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
    title: PropTypes.func,
  })
};

AmountDialog.defaultProps = {
  background: false,
};

export default memo(AmountDialog)