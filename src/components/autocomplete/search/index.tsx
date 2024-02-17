import './style.css';

import { cn as bem } from '@bem-react/classname';
import { useAutocomplete } from '..';
import React from 'react';

type SearchProps = {
  placeholder?: string;
  onChange: (search: string) => void;
};

function Search(props: SearchProps) {
  const cn = bem('Search');

  const { values, callbacks } = useAutocomplete();

  const handlers = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      callbacks.setSearch(value);
      props.onChange(value);
    },
  };

  return (
    <div className={cn()}>
      <input
        value={values.search}
        onChange={handlers.onChange}
        className={cn('input')}
        type='text'
        placeholder={props.placeholder}
      />
    </div>
  );
}

export default Search;
