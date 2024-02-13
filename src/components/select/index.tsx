import {memo} from "react";
import PropTypes from 'prop-types';
import { ISelectProps } from "./types";
import './style.css';

function Select(props: ISelectProps) {

  const onSelect= (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChange(event.target.value);
  };

  return (
    <select className="Select" value={props.value} onChange={onSelect}>
      {props.options.map(item => (
        <option key={item.value} value={item.value}>{item.title}</option>
      ))}
    </select>
  )
}

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string
  })).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func
};

Select.defaultProps = {
  onChange: () => {}
}

export default memo(Select);
