import {memo, useCallback, useLayoutEffect, useState} from 'react';
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import debounce from 'lodash.debounce';

import './style.css';

function Input(props) {

  // Внутренний стейт для быстрого отображения ввода
  const [value, setValue] = useState(props.value);

  const delay = props.delay ?? 0;

  const onChangeDebounce = useCallback(
    debounce(value => props.onChange(value, props.name), delay),
    [props.onChange, props.name, delay]
  );

  // Обработчик изменений в поле
  const onChange = (event) => {
    let newValue = event.target.value;
    if (props.validation === 'onlyNumber') {
      // Оставить только цифры
      const onlyNumber = newValue.replace(/[^\d]/g, '');
      // `String(Number(..))` делает: '00012' -> '12'
      newValue = onlyNumber ? String(Number(onlyNumber)) : '';
      const emptyString = newValue === '';
      if (!emptyString) {
        const greaterThanMin = newValue >= props.minValue;
        const lessThanMax = newValue <= props.maxValue
        const isValueInInterval = greaterThanMin && lessThanMax;
        // Не попадает в интервал `minValue .. maxValue`
        if (!isValueInInterval) newValue = value;
        // Меньше minValue
        if (props.minDefaultValue && !greaterThanMin) newValue = props.minDefaultValue
        // Больше maxValue
        if(props.maxDefaultValue && !lessThanMax) newValue = props.maxDefaultValue
      }
    }

    // Значение действительно новое (предотвращаем лишний рендер)
    if (newValue !== value) {
      setValue(newValue);
      onChangeDebounce(newValue);
    }
  };

  // Обновление стейта, если передан новый value
  useLayoutEffect(() => setValue(props.value), [props.value]);

  const width = String(value).length > 2 ? String(value).length : props.minWidth;

  const cn = bem('Input');
  return (
    <input
      className={cn({theme: props.theme})}
      value={value}
      type={props.type}
      placeholder={props.placeholder}
      onChange={onChange}
      autoFocus={props.autoFocus}
      style={props.stretch && {width: `${width}ch`}}
    />
  )
}

Input.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  theme: PropTypes.string,
}

Input.defaultProps = {
  onChange: () => {},
  type: 'text',
  theme: ''
}

export default memo(Input);
