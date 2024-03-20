import React, {memo} from "react";
import {SelectProps} from "@src/shared/ui/elements/select/types";
import './style.css';

const Select: React.FC<SelectProps> = (props) => {

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
