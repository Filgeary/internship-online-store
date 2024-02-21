import { memo, useCallback, useState } from "react";
import { cn as bem } from "@bem-react/classname";
import ItemCountry from "../item-country";
import { CountriesListProps } from "./type";
import './style.css';

function CountriesList(props: CountriesListProps) {
  const cn = bem("CountriesList");


  const callbacks = {
    onSelect: useCallback((_id: string) => {
      if (props.selected.length === 10) return;
      if (!_id) {
        props.onSelect([_id]);
        props.setSelected([]);
        return
      }
      if (!props.selected.includes(_id)) {
        props.setSelected((prev) => [...prev, _id]);
        props.onSelect([...props.selected, _id]);
      } else {
        const filterSelected = props.selected.filter((item) => item !== _id);
        props.setSelected(filterSelected);
        props.onSelect(filterSelected);
      }
    }, [props.selected])
  }

  return (
    <ul className={cn()}>
      {props.countries.map((country, index) => (
        <li
          className={cn("item", {
            selected: props.selected.includes(country._id),
            highlight: props.focusInd === index + 1,
          })}
          onClick={() => callbacks.onSelect(country._id)}
          tabIndex={index + 1}
          key={country._id}
        >
          <ItemCountry title={country.title} code={country.code} />
        </li>
      ))}
    </ul>
  );
}

export default memo(CountriesList);
