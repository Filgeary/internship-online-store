import React, {memo, useCallback, useState} from 'react';
import ModalLayout from "@src/components/modal-layout";
import Spinner from "@src/components/spinner";
import InputNumber from "@src/components/input-number";
import {cn as bem} from "@bem-react/classname";
import PropTypes from "prop-types";
import './style.css';
import numberFormat from "@src/utils/number-format";

function ModalAddBasket(props) {
  const [value, setValue] = useState(props.min)

  const cn = bem('modalAdding');

  const callback = {
    onSubmit: useCallback((e) => {
      e.preventDefault()
      props.data.handleSubmit(props.data._id, Number(value))
    }, [props.modalName, value]),
    onClose: useCallback((e) => {
      e.preventDefault()
      props.onClose()
    }, [props.modalName, value])
  }

  return (
      <ModalLayout title={props.data.title} labelClose={props.t('modalAdd.close')}
                   onClose={props.onClose}>
        <form className={cn('inputContainer')} onSubmit={callback.onSubmit}>

          <InputNumber max={props.max} theme={'inputContainer-input'}
                       name={props.name} min={props.min}
                       onChange={setValue}/>
          <span>{value
            ? ` ${props.t('modalAdd.article', value)} `
            : ''}</span>
          <span>{`${props.t('modalAdd.sum')}: ${numberFormat(props.data.price * value)} ₽`}</span>
          <div className={cn('button-container')}>
            <input type="button" onClick={callback.onClose} name="Cancel"
                   className={cn('button-cancel')} value={props.t('modalAdd.cancel')}/>
            <input type="submit" name="Ok" className={cn('button-ok')} value={props.t('modalAdd.ok')}/>
          </div>
        </form>
      </ModalLayout>
  );
}

ModalAddBasket.propTypes = {
  modalName: PropTypes.string,
  title: PropTypes.string,
  onClose: PropTypes.func,
  max: PropTypes.number,
  min: PropTypes.number,
  name: PropTypes.string,
  handleSubmit: PropTypes.func,
};

ModalAddBasket.defaultProps = {
  title: 'Товар',
  name: 'AddingToBasket',
  min: 1,
  max: 999,
  onClose: () => {},
  handleSubmit: () => {},
}

export default memo(ModalAddBasket);
