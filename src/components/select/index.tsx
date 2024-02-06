import {ChangeEvent, memo} from "react";
import './style.css';

interface SelectProps {
  options: {
    value: string | number,
    title: string
  }[],
  value: string,
  onChange: (value: string) => void
}

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
