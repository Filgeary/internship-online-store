import {ChangeEvent, memo} from "react";
import type { SelectProps } from "./type";
import './style.css';
import { Lang } from "@src/i18n/type";

function Select(props: SelectProps) {
  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    props.onChange(e.target.value as Lang);
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
