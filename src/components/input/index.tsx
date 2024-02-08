import React, {memo, useCallback, useLayoutEffect, useState} from 'react';
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import debounce from 'lodash.debounce';

import './style.css';

interface Props {
  value?: string,
  name?: string,
  type?: string,
  placeholder?: string,
  onChange: (text: string, name?: string) => void,
  theme?: string,
  delay?: number
}

const Input: React.FC<Props> = ({value = '', name = '', type = 'text', placeholder = '', onChange, theme = '', delay = 1000}) => {

  // Внутренний стейт для быстрого отображения ввода
  const [valueLocal, setValueLocal] = useState(value);

  const onChangeDebounce = useCallback(
    debounce(value => onChange(value, name), 600),
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

export default memo(Input);
