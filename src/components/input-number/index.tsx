import React, {memo, useCallback, useLayoutEffect, useState} from 'react';
import {cn as bem} from '@bem-react/classname';
import debounce from 'lodash.debounce';
import './style.css';

interface Props {
  max?: number,
  min?: number,
  name: string,
  onChange: (value: number, name: string) => void,
  placeholder?: string,
  theme?: string,
  value?: string
}

const InputNumber: React.FC<Props> = ({max = 999, min = 1, name, onChange, placeholder = '', theme = '', value}) => {

  // Внутренний стейт для быстрого отображения ввода
  const [localValue, setLocalValue] = useState(value);

  const onChangeDebounce = useCallback(
    debounce(value => onChange(Number(value), name), 0),
    [onChange, name]
  );

  // Обработчик изменений в поле
  //Так же я знаю о том что в firefox, не работает "type: number", поэтому я добавил дополнительную проверку
  const onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    const newValue = Number(event.target.value)
    // Если значение не входит в допустимый диапазон, то не вписываем это значение
    if(min <= newValue && max >= newValue) {
      setLocalValue(String(newValue));
      onChangeDebounce(newValue);
    } else {
      alert(`Введите число в диапазоне от ${min} до ${max}`)
    }
  };

  // Проверяет являться ли введенное значение числовым или нет если нет, то отменяет введения значения в поле
  // Так же эта функция проверяет нажатие клавиши т.к. "e", "-" и "+" не считываются функцией onChange, потому что считаются спец символами
  const handleKeyPress: (e: React.KeyboardEvent) => void = (event) => {
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
  useLayoutEffect(() => setLocalValue(value), [value]);

  const cn = bem('InputNumber');
  return (
    <input
      className={cn({theme: theme})}
      value={localValue || min}
      type={"number"}
      placeholder={placeholder || `Введите число от ${min} до ${max}`}
      onChange={onChangeInput}
      onKeyPress={handleKeyPress}
      max={max}
      min={min}
    />
  )
}

export default memo(InputNumber);
