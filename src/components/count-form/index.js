import { useState } from 'react';
import PropTypes from 'prop-types';

import './style.css';
import { cn as bem } from '@bem-react/classname';

function CountForm(props) {
  const cn = bem('CountForm');

  const [count, setCount] = useState(1);
  const isSubmitDisabled = count == 0 || props.isSuccess;

  const callbacks = {
    submit: (e) => {
      e.preventDefault();

      props.onSubmit({ count });
    },
  };

  const options = {
    maxVal: 999,
  };

  const handlers = {
    countChange: (e) => {
      props.setIsSuccess(false);
      const isEmpty = e.target.value === '';

      // Чтобы пользователь мог стереть (т.к. Math-операции преобразуют в '' -> 0)
      if (isEmpty) {
        setCount('');
        return;
      }

      // Для избежания лидирующих нулей (05 ; 020)
      const value = Number(e.target.value);
      const res = Math.min(value, options.maxVal);
      setCount(res.toString());
    },

    keyDown: (e) => {
      const [tabCode, backSpaceCode, enterCode] = [9, 8, 13];
      const [minusCode, plusCode] = [189, 187];
      const [arrowDown, arrowUp] = [40, 38];

      const notBeAffectedCodes = [tabCode, backSpaceCode, arrowDown, arrowUp, enterCode];
      const affectedReject = [minusCode, plusCode];

      const higherWillBeOnlyNums = 48;

      if (
        (e.keyCode < higherWillBeOnlyNums && !notBeAffectedCodes.includes(e.keyCode))
        ||
        affectedReject.includes(e.keyCode)
      ) {
        e.preventDefault();
      }
    },

    paste: (e) => e.preventDefault(),
  };

  return (
    <form onSubmit={callbacks.submit} className={cn()}>

      <div className={cn('row')}>
        {
          props.isSuccess &&
          <h3
            className={cn('title', { success: true })}
          >
            {props.successText(count)}
          </h3>
        }

        <div className={cn('field')}>
          <label htmlFor="count">{props.labelOfInput}:</label>
          <input
            className={cn('input')}
            type="number"
            name="count"
            id="count"
            min={0}
            max={999}
            onKeyDown={handlers.keyDown}
            onChange={handlers.countChange}
            onPaste={handlers.paste}
            value={count}
            placeholder="0-999"
          />
        </div>

        <div className={cn('footer')}>
          <button className={cn('button')} type="button" onClick={props.onCancel}>
            {props.labelOfCancel}
          </button>
          <button disabled={isSubmitDisabled} className={cn('button')} type="submit">
            {props.labelOfOk}
          </button>
        </div>
      </div>
    </form>
  );
}

CountForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  isSuccess: PropTypes.bool,
  setIsSuccess: PropTypes.func,
  labelOfInput: PropTypes.string,
  labelOfCancel: PropTypes.string,
  labelOfOk: PropTypes.string,
  successText: PropTypes.func,
};

CountForm.defaultProps = {
  labelOfInput: 'Введите количество',
  labelOfCancel: 'Отмена',
  labelOfOk: 'Ok',
  successText: () => {},
};

export default CountForm;