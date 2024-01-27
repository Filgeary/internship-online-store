import {memo, useCallback, useLayoutEffect, useState} from 'react';
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import debounce from 'lodash.debounce';

import './style.css';

function InputNumber(props) {

  // Внутренний стейт для быстрого отображения ввода
  const [value, setValue] = useState(props.value);

  // Обработчик изменений в поле
  //Так же я знаю о том что в firefox, не работает "type: number", поэтому я добавил дополнительную проверку
  const onChange = (event) => {
    const data = event.nativeEvent.data
    const targetValue = event.target.value
    const key = event.nativeEvent.inputType
    const pattern = /^[0-9\b\t]*$/

    if (
      pattern.test(data)
      || (key === 'deleteContentBackward' || key === 'deleteContentForward')
    ) {
      if (
        (props.min || props.min === 0) && props.max
        && targetValue > props.max || targetValue < props.min
      ) {
        alert(`Введите число в диапазоне от ${props.min} до ${props.max}`)
        return;
      }
      setValue(targetValue)
    } else if(!data) {
      setValue(targetValue);
    }
  };

  // Обновление стейта, если передан новый value
  useLayoutEffect(() => setValue(props.value), [props.value]);

  const cn = bem('Input');
  return (
    <input
      className={cn({theme: props.theme})}
      value={value}
      type={props.type}
      placeholder={props.placeholder}
      onChange={onChange}
      max={props.max}
      min={props.min}
    />
  )
}

InputNumber.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  theme: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number
}

InputNumber.defaultProps = {
  onChange: () => {},
  type: 'text',
  min: 0,
  theme: ''
}

export default memo(InputNumber);
