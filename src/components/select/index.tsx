import {ChangeEvent, memo} from "react";
import type { SelectProps } from "./type";
import { Lang } from "@src/i18n/type";
import './style.css';

function Select(props: SelectProps) {
  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    props.onChange(e.target.value as Lang & string & number);
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
