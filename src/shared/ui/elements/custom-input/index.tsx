import React, {useEffect, useRef} from 'react';
import './style.css';

interface CustomInputProps {
  value?: string,
  onChange: (value: string) => void,
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void,
  visible: boolean
}

function CustomInput({value = '', onChange, handleKeyDown, visible}: CustomInputProps) {
  const input = useRef(document.createElement('input'))

  useEffect(() => {
    visible ? input.current.focus() : onChange('')
  }, [visible])

  // Обработчик изменений в поле
  const onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    onChange(event.target.value);
  };


  return (
    <input
      onKeyDown={handleKeyDown}
      value={value}
      onChange={onChangeInput}
      placeholder={'Поиск'}
      className={'CustomInput'}
      ref={input}/>
  );
}

export default CustomInput;
