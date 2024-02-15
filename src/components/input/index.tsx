import {type ChangeEvent, memo, useCallback, useLayoutEffect, useState, ChangeEventHandler} from 'react';
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import debounce from 'lodash.debounce';
import { InputProps } from './types';
import './style.css';

function Input<
  Value extends string,
  Name extends string | undefined
>(props: InputProps<Value, Name>) {

  // Внутренний стейт для быстрого отображения ввода
  const [value, setValue] = useState(props.value);

  const onChangeDebounce = useCallback(
    debounce((value: Value) => props.onChange(value, props.name as Name), props.delay || 600),
    [props.onChange, props.name]
  );

  // Обработчик изменений в поле
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value as Value);
    onChangeDebounce(event.target.value);
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

// Input.propTypes = {
//   value: PropTypes.string,
//   name: PropTypes.string,
//   type: PropTypes.string,
//   placeholder: PropTypes.string,
//   onChange: PropTypes.func,
//   theme: PropTypes.string,
//   delay: PropTypes.number
// }

// Input.defaultProps = {
//   onChange: () => {},
//   type: 'text',
//   theme: ''
// }

export default memo(Input) as typeof Input;
