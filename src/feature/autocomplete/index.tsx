import React, {useEffect, useState} from 'react';
import {AutocompleteProps} from "@src/feature/autocomplete/types";

/**
 * Компонент для объединения действий над выпадающими списками
 * @param filteredOptions массив с опциями, для соответствущего селекта
 * @param inputBuilder поле ввода, которое кастомизированно извне
 * @param onSelect функция выбор определенного элемента
 * @param optionsBuilder функция для обработки поля ввода, вызывается при вводе в инпут, предполагается что будет изменять входящий список опций
 * @param optionsViewBuilder компонент опций, список в который будет передан список опций
 * @param visible Параметр отвечающий за отображение данного компонента, так как этот компонент будет выпадающим списком, он будет не видим до раскрытия
 * */
function Autocomplete({
                        filteredOptions,
                        inputBuilder,
                        onSelect,
                        optionsBuilder,
                        optionsViewBuilder,
                        visible = true,
                      }: AutocompleteProps) {
  const [value, setValue] = useState('');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1);

  useEffect(() => {
    setSelectedOptionIndex(0)
  }, [visible])

  const onChange = (value: string) => {
    setSelectedOptionIndex(0);
    setValue(value);
    optionsBuilder(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (visible) {
      setSelectedOptionIndex(prevState => {
        if ((e.key === 'ArrowDown' || e.key === 'Tab') && prevState < (filteredOptions.length - 1)) {
          e.preventDefault()
          return prevState + 1
        }
        if (e.key === 'ArrowUp' && prevState > 0) {
          e.preventDefault()
          return prevState - 1
        }
        return prevState
      })
      if (e.key === 'Enter' && selectedOptionIndex !== -1) {
        onSelected(filteredOptions[selectedOptionIndex]._id);
      }
    }
  };
  function onSelected (selectValue: string) {
    onSelect(selectValue);
  }

  return (
    <>
      {inputBuilder({
        onChange,
        handleKeyDown,
        value,
        visible
      })}
      {optionsViewBuilder({
        onSelected,
        filteredOptions,
        selectedOptionIndex,
        setSelectedOptionIndex,
        visible
      })}
    </>
  );
}

export default Autocomplete;
