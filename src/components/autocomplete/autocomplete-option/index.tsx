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
  const { values, helpers, callbacks, listRef, searchRef, firstOptionRef, disabled } =
    useAutocompleteContext();

  const optionRef = useRef<HTMLDivElement>(null);

  // const isActive =
  //   (values.active._id === props.option._id || values.inFocus === indexForFocus) && !isTitle;
  // const isActive = values.value.includes(props.option._id) && !isTitle;
  const isActive =
    (values.active._id === props.option._id && Boolean(props.option._id)) ||
    (values.value.includes(props.option._id) && Boolean(props.option._id));

  const handlers = {
    onClick: () => {
      callbacks.setActive(option);
    },
  };

  useEffect(() => {
    if (disabled) return;

    if (isActive && optionRef.current && listRef.current) {
      // При раскрытии - активный будет по центру и в фокусе
      if (!values.search && document.activeElement !== searchRef.current) {
        // Для совместимости с плавной анимацией (smooth = true)
        window.requestIdleCallback(() => {
          // optionRef.current?.focus();
        });
      }
      window.requestAnimationFrame(() => {
        listRef.current?.scrollTo(
          0,
          optionRef.current.offsetTop - listRef.current.clientHeight / 2
        );
      });
    }
  }, [values.isOpen, isActive, disabled]);

  useEffect(() => {
    if (disabled) return;

    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        e.preventDefault();
        handlers.onClick();
      }
    };

    optionRef.current?.addEventListener('keydown', listener);

    return () => optionRef.current?.removeEventListener('keydown', listener);
  }, [disabled]);

  useEffect(() => {
    if (disabled) return;

    if (!firstOptionRef.current) {
      firstOptionRef.current = optionRef.current;
    }

    return () => {
      firstOptionRef.current = null;
    };
  }, [values.search, disabled]);

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
