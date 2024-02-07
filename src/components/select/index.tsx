import React, { memo } from 'react';
import './style.css';

type SelectProps = {
  options: Array<{ value: string | number; title: string }>;
  value: any;
  onChange?: (value: any) => void;
};

const defaultProps: Omit<SelectProps, 'options' | 'value'> = {
  onChange: () => {},
};

Select.defaultProps = defaultProps;

function Select(props: SelectProps) {
  const onSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChange(e.target.value);
  };

  return (
    <select className='Select' value={props.value} onChange={onSelect}>
      {props.options.map((item) => (
        <option key={item.value} value={item.value}>
          {item.title}
        </option>
      ))}
    </select>
  );
}

export default memo(Select);
