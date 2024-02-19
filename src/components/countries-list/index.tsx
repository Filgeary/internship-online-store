import { cn as bem } from "@bem-react/classname";
import ItemCountry from "../item-country";
import './style.css';
import { CountriesListProps } from "./type";
import { memo } from "react";
import useKeyPress from "@src/hooks/use-key-press";

function CountriesList(props: CountriesListProps) {
  const arrowDown = useKeyPress("ArrowDown");
  const arrowUp = useKeyPress("ArrowUp");
  const enter = useKeyPress("Enter");
  const cn = bem("CountriesList");

  return (
    <ul className={cn()}>
      {props.countries.map((country, index) => (
        <li
          className={cn("item", {
            selected: props.selectedItemId === country._id,
          })}
          onClick={() => props.onSelect(country)}
          tabIndex={index}
          key={country._id}
        >
          <ItemCountry title={country.title} code={country.code} />
        </li>
      ))}
    </ul>
  );
}

export default memo(CountriesList);
