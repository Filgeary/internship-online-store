import {memo} from "react";
import './style.css';

interface SelectProps {
  options: {
    value: string | number,
    title: string
  }[],
  value: any,
  onChange: (value: any) => void
}

function Select({onChange = () => {}, ...props}: SelectProps) {

  const onSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
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
