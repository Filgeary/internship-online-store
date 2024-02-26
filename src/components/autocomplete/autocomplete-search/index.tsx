import './style.css';

import { cn as bem } from '@bem-react/classname';
import { useAutocompleteContext } from '..';
import React, { memo } from 'react';
import AutocompleteVariants from '../autocomplete-variants';

type SearchProps = {
  placeholder?: string;
  onChange: (search: string) => void;
};

function AutocompleteSearch(props: SearchProps) {
  const cn = bem('AutocompleteSearch');

  const { values, options, callbacks, searchRef, listRef } = useAutocompleteContext();

  const handlers = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      listRef.current?.scrollToTop();

      callbacks.setSearch(value);
      props.onChange(value);
    },
  };

  return (
    <div className={cn()}>
      <input
        ref={searchRef}
        value={values.search}
        onChange={handlers.onChange}
        className={cn('input')}
        type='text'
        placeholder={props.placeholder}
      />
      {options.isMultipleSelected && options.showActiveCodes && <AutocompleteVariants />}
    </div>
  );
}

export default memo(AutocompleteSearch);
