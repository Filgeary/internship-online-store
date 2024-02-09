import { memo } from "react";
import "./style.css";

type Option = {
  value: string | number;
  title: string;
};

type SelectProps = {
  options: Option[];
  value: string | number;
  onChange: (value: string) => void;
};

function Select(props: SelectProps) {
  const onSelect = (e) => {
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

Select.defaultProps = {
  onChange: () => {},
};

export default memo(Select);
