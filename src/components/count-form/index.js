import { useState } from 'react';
import PropTypes from 'prop-types';

import './style.css';
import { cn as bem } from '@bem-react/classname';

function CountForm(props) {
  const cn = bem('CountForm');

  const [count, setCount] = useState(1);
  const isSubmitDisabled = count == 0;

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
      const isEmpty = e.target.value === '';

      // Чтобы пользователь мог стереть (т.к. Math-операции преобразуют в '' -> 0)
      if (isEmpty) {
        setCount('');
        return;
      }

      const count = Math.abs(e.target.value);
      setCount(Math.min(count, options.maxVal));
    },
  };

  return (
    <form onSubmit={callbacks.submit} className={cn()}>
      <div className={cn('row')}>
        <div className={cn('field')}>
          <label htmlFor="count">Введите количество:</label>
          <input
            className={cn('input')}
            type="number"
            name="count"
            id="count"
            onChange={handlers.countChange}
            value={count}
            placeholder="0-999"
          />
        </div>

        <div className={cn('footer')}>
          <button className={cn('button')} type="button" onClick={props.onCancel}>
            Отмена
          </button>
          <button disabled={isSubmitDisabled} className={cn('button')} type="submit">
            Ок
          </button>
        </div>
      </div>
    </form>
  );
}

CountForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default CountForm;