import {CSSProperties, ChangeEvent, ChangeEventHandler, memo, useCallback, useLayoutEffect, useState} from 'react';
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import debounce from 'lodash.debounce';
import { IInputProps } from './types';
import './style.css';

function Input(props: IInputProps) {

  // Внутренний стейт для быстрого отображения ввода
  const [value, setValue] = useState(props.value);

  const delay = props.delay ?? 0;

  const onChangeDebounce = useCallback(
    debounce(value => props.onChange?.(value, props.name), delay),
    [props.onChange, props.name, delay]
  );

  // Обработчик изменений в поле
  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    let newValue = event.target.value;
    if (props.validation === 'onlyNumber') {
      // Оставить только цифры
      const onlyNumber = newValue.replace(/[^\d]/g, '');
      // `String(Number(..))` делает: '00012' -> '12'
      newValue = onlyNumber ? String(Number(onlyNumber)) : '';
      const emptyString = newValue === '';
      if (!emptyString && props.minValue && props.maxValue) {
        const greaterThanMin = Number(newValue) >= props.minValue;
        const lessThanMax = Number(newValue) <= props.maxValue;
        const isValueInInterval = greaterThanMin && lessThanMax;
        // Не попадает в интервал `minValue .. maxValue`
        if (!isValueInInterval) newValue = value;
        // Меньше minValue
        if (props.minDefaultValue && !greaterThanMin) newValue = String(props.minDefaultValue)
        // Больше maxValue
        if(props.maxDefaultValue && !lessThanMax) newValue = String(props.maxDefaultValue)
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
      className={cn({ theme: props.theme })}
      name={props.name}
      value={value}
      type={props.type}
      placeholder={props.placeholder}
      onChange={onChange}
      autoFocus={props.autoFocus}
      style={(props.stretch && {width: `${width}ch`}) as CSSProperties}
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
  validation: PropTypes.string,
  autoFocus: PropTypes.bool,
  delay: PropTypes.number,
  minWidth: PropTypes.number,
  stretch: PropTypes.bool,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  minDefaultValue: PropTypes.number,
  maxDefaultValue: PropTypes.number,
}

Input.defaultProps = {
  onChange: () => {},
  type: 'text',
  theme: ''
}

export default memo(Input);
