import {ChangeEvent, memo} from "react";
import type { SelectProps } from "./type";
import './style.css';

function Select(props: SelectProps) {
  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    props.onChange(e.target.value);
  };

  return (
    <select className="Select" value={props.value} onChange={onSelect}>
      {props.options.map(item => (
        <option key={item.value} value={item.value}>{item.title}</option>
      ))}
    </select>
  )
}

export default memo(Select);
