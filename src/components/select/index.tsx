import { memo } from "react";
import "./style.css";
import { TLang } from "@src/i18n/translate";

type TSelectProps = {
  options: any[];
  value?: any;
  onChange: (lang: TLang) => void;
};
function Select(props: TSelectProps) {
  const onSelect = (e: any) => {
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
