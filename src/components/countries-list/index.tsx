import { LegacyRef, forwardRef, memo, useCallback } from "react";
import { cn as bem } from "@bem-react/classname";
import ItemCountry from "../item-country";
import { CountriesListProps } from "./type";
import './style.css';

function CountriesList(props: CountriesListProps, ref: LegacyRef<HTMLUListElement>) {
  const cn = bem("CountriesList");
  const callbacks = {
    onSelect: useCallback((_id: string) => {
      if (!_id) {
        props.onSelect([_id]);
        return
      }
      if (!props.selected.includes(_id)) {
        props.onSelect([...props.selected, _id]);
      } else {
        const filterSelected = props.selected.filter((item) => item !== _id);
        props.onSelect(filterSelected);
      }
    }, [props.selected])
  }
  
  return (
    <ul className={cn()} ref={ref}>
      {props.countries.map((country, index) => (
        <li
          className={cn("item", {
            selected: props.selected.includes(country._id),
            highlight: props.focusInd === index,
          })}
          onClick={() => callbacks.onSelect(country._id)}
          tabIndex={index}
          key={country._id}
        >
          <ItemCountry title={country.title} code={country.code} />
        </li>
      ))}
    </ul>
  );
}

export default memo(forwardRef(CountriesList));
