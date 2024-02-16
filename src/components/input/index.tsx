import { cn as bem } from '@bem-react/classname';
import debounce from 'lodash.debounce';
import React, { memo, useCallback, useLayoutEffect, useState } from 'react';

import './style.css';

type Props = {
  value: string;
  name: string;
  onChange: (value: string, name: string) => void;
  placeholder?: string;
  type?: string;
  theme?: string;
  delay?: number;
};

function Input(props: Props) {
  const cn = bem('Input');
  const [internalInputValue, setInternalInputValue] = useState(props.value);

  const onChangeDebounce = useCallback(
    debounce(value => props.onChange(value, props.name), props.delay || 500),
    [props.onChange, props.name],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalInputValue(event.target.value);
    onChangeDebounce(event.target.value);
  };

  // Обновление state, если передан новый value
  useLayoutEffect(() => setInternalInputValue(props.value), [props.value]);

  return (
    <input
      className={cn({ theme: props.theme || '' })}
      value={internalInputValue}
      type={props.type || 'text'}
      placeholder={props.placeholder}
      onChange={handleChange}
    />
  );
}

export default memo(Input);
