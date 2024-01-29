import {memo, useCallback, useLayoutEffect, useState} from 'react';
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import debounce from 'lodash.debounce';

import './style.css';

function InputNumber(props) {

  // Внутренний стейт для быстрого отображения ввода
  const [value, setValue] = useState(props.value);

  const onChangeDebounce = useCallback(
    debounce(value => props.onChange(Number(value), props.name), 200),
    [props.onChange, props.name]
  );

  // Обработчик изменений в поле
  //Так же я знаю о том что в firefox, не работает "type: number", поэтому я добавил дополнительную проверку
  const onChange = (event) => {
    const newValue = event.target.value
    // Если значение не входит в допустимый диапазон, то не вписываем это значение
    if(props.min <= newValue && props.max >= newValue) {
      setValue(newValue);
      onChangeDebounce(newValue);
    } else {
      alert(`Введите число в диапазоне от ${props.min} до ${props.max}`)
    }
  };

  // Проверяет являться ли введенное значение числовым или нет если нет, то отменяет введения значения в поле
  // Так же эта функция проверяет нажатие клавиши т.к. "e", "-" и "+" не считываются функцией onChange, потому что считаются спец символами
  const handleKeyPress = (event) => {
    // Регулярное выражение, разрешающее только цифры
    const allowedChars = /^[0-9]+$/;
    const charCode = event.which ? event.which : event.keyCode;

    const char = String.fromCharCode(charCode);

    // С помощью регулярного выражения проверка на то является ли нажатый символ числом
    if (!allowedChars.test(char)) {
      event.preventDefault();
    }
  };

  // Обновление стейта, если передан новый value
  useLayoutEffect(() => setValue(props.value), [props.value]);

  const cn = bem('Input');
  return (
    <input
      className={cn({theme: props.theme})}
      value={value || props.min}
      type={"number"}
      placeholder={props.placeholder || `Введите число от ${props.min} до ${props.max}`}
      onChange={onChange}
      onKeyPress={handleKeyPress}
      max={props.max}
      min={props.min}
    />
  )
}

InputNumber.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  theme: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number
}

InputNumber.defaultProps = {
  onChange: () => {},
  type: 'text',
  min: 1,
  max: 999,
  theme: ''
}

export default memo(InputNumber);
