import { memo, useCallback, useState } from "react";
import { cn as bem } from "@bem-react/classname";
import ItemCountry from "../item-country";
import { CountriesListProps } from "./type";
import './style.css';

function CountriesList(props: CountriesListProps) {
  const cn = bem("CountriesList");
  const firstState = props.selectedItemId.split('|').filter(item => item);

  const [selected, setSelected] = useState<string[]>(firstState);

  const callbacks = {
    onSelect: useCallback((_id: string) => {
      if (!_id) {
        props.onSelect([_id]);
        setSelected([]);
        return
      }
      if (!selected.includes(_id)) {
        setSelected((prev) => [...prev, _id]);
        props.onSelect([...selected, _id]);
      } else {
        const filterSelected = selected.filter((item) => item !== _id);
        setSelected(filterSelected);
        props.onSelect(filterSelected);
      }
    }, [selected])
  }

  return (
    <ul className={cn()}>
      {props.countries.map((country, index) => (
        <li
          className={cn("item", {
            selected: selected.includes(country._id),
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
