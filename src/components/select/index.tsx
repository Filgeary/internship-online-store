import { ChangeEvent, memo } from "react";
import { SelectPropsType } from "./types";
import './style.css';

function Select(props: SelectPropsType) {

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

// Select.defaultProps = {
//   onChange: () => {}
// }

export default memo(Select);
