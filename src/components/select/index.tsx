import { memo } from "react";
import "./style.css";

type TSelectProps = {
  options: { value: string | number; title: string }[];
  value?: any;
  onChange: (value: string | number) => void;
};
function Select(props: TSelectProps) {
  const onSelect = (e: { target: { value: string | number } }) => {
    props.onChange(e.target.value);
  };

  return (
    <select className="Select" value={props.value} onChange={onSelect}>
      {props.options.map((item) => (
        <option key={item.value} value={item.value}>
          {item.title}
        </option>
      ))}
    </select>
  );
}

/* Select.defaultProps = {
  onChange: () => {},
}; */

export default memo(Select);
