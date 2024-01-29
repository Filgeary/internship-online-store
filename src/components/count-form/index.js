import { useState, useRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';

import './style.css';
import { cn as bem } from '@bem-react/classname';

function CountForm(props) {
  const cn = bem('CountForm');

  const inputRef = useRef(null);
  const [count, setCount] = useState(props.min === 0 ? props.min + 1 : props.min);
  const isSubmitDisabled = count == 0 || props.isSuccess;

  const callbacks = {
    submit: (e) => {
      e.preventDefault();
      props.onSubmit({ count });
    },
  };

  const options = {
    minVal: props.min,
    maxVal: props.max,
    placeholder: props.max !== Infinity ? `${props.min}-${props.max}` : `${props.min}-...`,
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

  useEffect(() => {
    inputRef.current.focus();
  }, []);

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
            min={options.minVal}
            max={options.maxVal}
            onKeyDown={handlers.keyDown}
            onChange={handlers.countChange}
            onPaste={handlers.paste}
            value={count}
            placeholder={options.placeholder}
            ref={inputRef}
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
  initialFocus: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
};

CountForm.defaultProps = {
  labelOfInput: 'Введите количество',
  labelOfCancel: 'Отмена',
  labelOfOk: 'Ok',
  successText: () => {},
  initialFocus: false,
  min: 0,
  max: 999,
};

export default memo(CountForm);
