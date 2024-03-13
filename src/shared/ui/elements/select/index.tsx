import React, {memo} from "react";
import './style.css';

export interface Option {
  value: string | number,
  title: string
}

interface Props {
  onChange: (value: any) => void,
  value: string,
  options: Option[]
}

const Select: React.FC<Props> = (props) => {

  const onSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChange(e.target.value);
  };

  return (
    <select className="Select" value={props.value} onChange={e => onSelect(e)}>
      {props.options.map(item => (
        <option key={item.value} value={item.value}>{item.title}</option>
      ))}
    </select>
  )
}

export default memo(Select);
