import { cn as bem } from '@bem-react/classname';
import debounce from 'lodash.debounce';
import { memo, useCallback, useLayoutEffect, useState } from 'react';

import './style.css';

const IS_TEST = process.env.NODE_ENV === 'test';

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

  // TODO: check debounce usage with useCallback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChangeDebounce = useCallback(
    debounce(value => props.onChange(value, props.name), (IS_TEST ? 0 : props.delay) || 0),
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
      data-testid='input-search'
      name={props.name}
      className={cn({ theme: props.theme || '' })}
      value={internalInputValue}
      type={props.type || 'text'}
      placeholder={props.placeholder}
      onChange={handleChange}
    />
  );
}

export default memo(Input);
