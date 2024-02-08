import React, {memo, useCallback, useState} from 'react';
import ModalLayout from "@src/components/modal-layout";
import InputNumber from "@src/components/input-number";
import {cn as bem} from "@bem-react/classname";
import './style.css';
import numberFormat from "@src/utils/number-format";

interface Props {
  modalName?: string,
  title?: string,
  onClose: (value?: string | number) => any,
  data: any,
  max?: number,
  min?: number,
  name?: string
  t: (key: string, amount?: number) => string
}

const ModalAddBasket: React.FC<Props> = ({title = 'Товар', data, modalName = '', onClose, max = 999, min = 1, name = 'AddingToBasket', t}) => {
  const [value, setValue] = useState(min)

  const cn = bem('modalAdding');

  const callback = {
    onSubmit: useCallback((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      onClose(value)
    }, [modalName, value]),
    onClose: useCallback((e: React.MouseEvent) => {
      e.preventDefault()
      onClose()
    }, [modalName, value])
  }

  return (
      <ModalLayout title={'Добавить в корзину: ' + data.title} labelClose={t('modalAdd.close')}
                   onClose={callback.onClose}>
        <form className={cn('inputContainer')} onSubmit={callback.onSubmit}>

          <InputNumber max={max} theme={'inputContainer-input'}
                       name={name} min={min}
                       onChange={setValue}/>
          <span>{value
            ? ` ${t('modalAdd.article', value)} `
            : ''}</span>
          <span>{`${t('modalAdd.sum')}: ${numberFormat(data.price * value)} ₽`}</span>
          <div className={cn('button-container')}>
            <input type="button" onClick={callback.onClose} name="Cancel"
                   className={cn('button-cancel')} value={t('modalAdd.cancel')}/>
            <input type="submit" name="Ok" className={cn('button-ok')} value={t('modalAdd.ok')}/>
          </div>
        </form>
      </ModalLayout>
  );
}

export default memo(ModalAddBasket);
