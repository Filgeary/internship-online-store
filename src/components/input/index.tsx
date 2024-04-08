import {ChangeEvent, memo, useCallback, useEffect, useState} from 'react';
import {cn as bem} from '@bem-react/classname';
import debounce from 'lodash.debounce';
import { InputPropsType } from './types';
import './style.css';

function Input(props: InputPropsType) {

  // Внутренний стейт для быстрого отображения ввода
  const [value, setValue] = useState(props.value);

  const onChangeDebounce = useCallback(
    debounce(value => props.onChange(value, props.name), 600),
    [props.onChange, props.name]
  );

  // Обработчик изменений в поле
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChangeDebounce(event.target.value);
  };

  // Обновление стейта, если передан новый value
  useEffect(() => setValue(props.value), [props.value]);

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

// Input.defaultProps = {
//   onChange: () => {},
//   type: 'text',
//   theme: ''
// }

export default memo(Input);
