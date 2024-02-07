import React, { useState, useRef, useEffect, memo } from 'react';

import './style.css';
import { cn as bem } from '@bem-react/classname';
import SuccessBlock from '../success-block';

type CountFormProps = {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  isSuccess: boolean;
  setIsSuccess?: (newIsSuccess: boolean) => void;
  labelOfInput: string;
  labelOfCancel: string;
  labelOfOk: string;
  successText: (count: number | string) => string;
  initialFocus: boolean;
  min: number;
  max: number;
};

const defaultProps: CountFormProps = {
  isSuccess: false,
  labelOfInput: 'Введите количество',
  labelOfCancel: 'Отмена',
  labelOfOk: 'Ok',
  successText: () => 'Успех',
  initialFocus: false,
  min: 0,
  max: 999,
};

CountForm.defaultProps = defaultProps;

function CountForm(props: CountFormProps) {
  const cn = bem('CountForm');

  const inputRef = useRef(null);
  const [count, setCount] = useState<number | string>(
    props.min === 0 ? props.min + 1 : props.min
  );
  const isSubmitDisabled = count == 0 || props.isSuccess;

  const callbacks = {
    submit: (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      props.onSubmit({ count });
    },
  };

  const options = {
    minVal: props.min,
    maxVal: props.max,
    placeholder:
      props.max !== Infinity ? `${props.min}-${props.max}` : `${props.min}-...`,
  };

  const handlers = {
    countChange: (e: React.ChangeEvent<HTMLInputElement>) => {
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

    keyDown: (e: React.KeyboardEvent) => {
      const [tabCode, backSpaceCode, enterCode] = [9, 8, 13];
      const [minusCode, plusCode] = [189, 187];
      const [arrowDown, arrowUp] = [40, 38];

      const notBeAffectedCodes = [
        tabCode,
        backSpaceCode,
        arrowDown,
        arrowUp,
        enterCode,
      ];
      const affectedReject = [minusCode, plusCode];

      const higherWillBeOnlyNums = 48;

      if (
        (e.keyCode < higherWillBeOnlyNums &&
          !notBeAffectedCodes.includes(e.keyCode)) ||
        affectedReject.includes(e.keyCode)
      ) {
        e.preventDefault();
      }
    },

    paste: (e: React.ClipboardEvent) => e.preventDefault(),
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <form onSubmit={callbacks.submit} className={cn()}>
      <div className={cn('row')}>
        {props.isSuccess && (
          <SuccessBlock>{props.successText(count)}</SuccessBlock>
        )}

        <div className={cn('field')}>
          <label htmlFor='count'>{props.labelOfInput}:</label>
          <input
            className={cn('input')}
            type='number'
            name='count'
            id='count'
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
          <button
            className={cn('button')}
            type='button'
            onClick={props.onCancel}
          >
            {props.labelOfCancel}
          </button>
          <button
            disabled={isSubmitDisabled}
            className={cn('button')}
            type='submit'
          >
            {props.labelOfOk}
          </button>
        </div>
      </div>
    </form>
  );
}

export default memo(CountForm);
