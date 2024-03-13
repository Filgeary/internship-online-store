import React, {useCallback, useLayoutEffect, useState} from 'react';
import {cn as bem} from '@bem-react/classname';
import debounce from 'lodash.debounce';

import './style.css';

interface Props<T> {
  value?: string,
  name: T,
  type?: string,
  placeholder?: string,
  onChange: (text: string, name: T) => void,
  theme?: string,
  delay?: number
}

function Input<T>({ value, name, type = 'text', placeholder = '', onChange, theme = '', delay = 600 }: Props<T>) {

  // Внутренний стейт для быстрого отображения ввода
  const [valueLocal, setValueLocal] = useState(value);

  const onChangeDebounce = useCallback(
    debounce(value => onChange(value, name), delay),
    [onChange, name]
  );

  // Обработчик изменений в поле
  const onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    setValueLocal(event.target.value);
    onChangeDebounce(event.target.value);
  };

  // Обновление стейта, если передан новый value
  useLayoutEffect(() => setValueLocal(value), [value]);

  const cn = bem('Input');
  return (
    <input
      className={cn({theme: theme})}
      value={valueLocal}
      type={type}
      placeholder={placeholder}
      onChange={onChangeInput}
    />
  )
}

export default Input;
