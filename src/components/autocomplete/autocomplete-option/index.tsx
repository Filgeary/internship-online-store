import './style.css';

import { memo, useEffect, useRef } from 'react';
import { TOption, useAutocomplete } from '..';
import AutocompleteField from '../autocomplete-field';

type OptionProps = {
  option: TOption;
  isDisabled?: boolean;
  isTitle?: boolean;
};

function AutocompleteOption(props: OptionProps) {
  const { option, isDisabled, isTitle } = props;
  const { values, helpers, callbacks, listRef, searchRef } = useAutocomplete();

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
        optionRef.current.focus();
      }
      window.requestAnimationFrame(() => {
        listRef.current.scrollTo(0, optionRef.current.offsetTop - listRef.current.clientHeight / 2);
      });
    }
  }, [isActive]);

  return (
    <AutocompleteField
      ref={optionRef}
      isDisabled={isDisabled}
      isActive={isActive}
      onClick={handlers.onClick}
      onKeyDown={helpers.onSpaceDown(handlers.onClick)}
      code={option.code}
      title={option.title}
    />
  );
}

export default memo(AutocompleteOption);
