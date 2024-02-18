import './style.css';

import { memo, useEffect, useRef } from 'react';
import { TOption, useAutocompleteContext } from '..';
import AutocompleteField from '../autocomplete-field';

type OptionProps = {
  option: TOption;
  isDisabled?: boolean;
  isTitle?: boolean;
  displayString: (option: TOption) => string;
  indexForFocus?: number;
};

function AutocompleteOption(props: OptionProps) {
  const { option, isDisabled, isTitle, displayString, indexForFocus } = props;
  const { values, helpers, callbacks, listRef, searchRef, allOptionsRefs, firstOptionRef } =
    useAutocompleteContext();

  const optionRef = useRef<HTMLDivElement>(null);

  const isActive = values.active._id === props.option._id && !isTitle;

  const handlers = {
    onClick: () => {
      callbacks.setActive(option);
    },
  };

  useEffect(() => {
    if (isActive && optionRef.current && listRef.current) {
      // При раскрытии - активный будет по центру и в фокусе
      if (!values.search && document.activeElement !== searchRef.current) {
        // Для совместимости с плавной анимацией (smooth = true)
        window.requestIdleCallback(() => {
          optionRef.current.focus();
        });
      }
      window.requestAnimationFrame(() => {
        listRef.current?.scrollTo(
          0,
          optionRef.current.offsetTop - listRef.current.clientHeight / 2
        );
      });
    }
  }, [values.isOpen, isActive]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        e.preventDefault();
        handlers.onClick();
      }
    };

    optionRef.current?.addEventListener('keydown', listener);

    return () => optionRef.current?.removeEventListener('keydown', listener);
  }, []);

  useEffect(() => {
    if (!firstOptionRef.current) {
      firstOptionRef.current = optionRef.current;
    }

    return () => {
      firstOptionRef.current = null;
    };
  }, [values.search]);

  // Для варианта через рефы
  // useEffect(() => {
  //   console.log(optionRef.current);
  //   const index = allOptionsRefs.current.length;
  //   allOptionsRefs.current.push(optionRef.current);

  //   return () => {
  //     // allOptionsRefs.current.splice(index, 1);
  //     delete allOptionsRefs.current[index];
  //   };
  // }, [values.isOpen]);

  // Для React-way перемещения по стрелочкам
  // useEffect(() => {
  //   if (values.inFocus === indexForFocus) {
  //     optionRef.current.focus();
  //   }
  // }, [values.inFocus]);

  return (
    <AutocompleteField
      ref={optionRef}
      isDisabled={isDisabled}
      isActive={isActive}
      onClick={handlers.onClick}
      onKeyDown={helpers.onSpaceDown(handlers.onClick)}
      code={option.code}
      title={displayString(option)}
    />
  );
}

export default memo(AutocompleteOption);
