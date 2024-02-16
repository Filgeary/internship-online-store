import React, { memo } from 'react';

import './style.css';

type Props = {
  options: {
    value: string | number;
    title: string;
  }[];
  value: string | number;
  onChange: (value: any) => void;
};

function Select({ options, value, onChange }: Props) {
  const onSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      className='Select'
      value={value}
      onChange={onSelect}
    >
      {options.map(item => (
        <option
          key={item.value}
          value={item.value}
        >
          {item.title}
        </option>
      ))}
    </select>
  );
}

export default memo(Select);
