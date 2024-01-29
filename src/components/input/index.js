import {memo, useCallback, useLayoutEffect, useState} from 'react';
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import debounce from 'lodash.debounce';

import './style.css';

function Input(props) {

  // Внутренний стейт для быстрого отображения ввода
  const [value, setValue] = useState(props.value);

  const onChangeDebounce = useCallback(
    debounce(value => props.onChange(value, props.name), 600),
    [props.onChange, props.name]
  );

  // Обработчик изменений в поле
  const onChange = (event) => {
    let newValue = event.target.value;
    if (props.validation === 'onlyNumber') {
      const onlyNumber = newValue.replace(/[^\d]/g, '');
      // `String(Number(..))` делает: '00012' -> '12'
      newValue = onlyNumber ? String(Number(onlyNumber)) : '';
      if (props.defaultValue) {
        if (newValue === '0') newValue = props.defaultValue;
      }
    }

    if (newValue !== value) {
      setValue(newValue);
      onChangeDebounce(newValue);
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
