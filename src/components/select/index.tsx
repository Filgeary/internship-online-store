import {type ChangeEvent, memo} from "react";
import PropTypes from 'prop-types';
import type { SelectProps } from "./types";
import './style.css';

function Select<T extends string>(props: SelectProps<T>) {

  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as T
    props.onChange(value)
  };

  return (
    <select className="Select" value={props.value} onChange={onSelect}>
      {props.options.map(item => (
        <option key={item.value} value={item.value}>{item.title}</option>
      ))}
    </select>
  )
}

// Select.propTypes = {
//   options: PropTypes.arrayOf(PropTypes.shape({
//     value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     title: PropTypes.string
//   })).isRequired,
//   value: PropTypes.any,
//   onChange: PropTypes.func
// };

// Select.defaultProps = {
//   onChange: () => {}
// }


export default memo(Select) as typeof Select
