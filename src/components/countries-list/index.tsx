import { memo, useEffect, useRef } from "react";
import { cn as bem } from "@bem-react/classname";
import ItemCountry from "../item-country";
import useKeyPress from "@src/hooks/use-key-press";
import { CountriesListProps } from "./type";
import './style.css';

function CountriesList(props: CountriesListProps) {
  const arrowDown = useKeyPress("ArrowDown");
  const arrowUp = useKeyPress("ArrowUp");
  const enter = useKeyPress("Enter");
  const cn = bem("CountriesList");

  const countryRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if(enter) {
      countryRef.current?.click();
    }
  }, [enter])

  return (
    <ul className={cn()}>
      {props.countries.map((country, index) => (
        <li
          className={cn("item", {
            selected: props.selectedItemId === country._id,
          })}
          onClick={() => props.onSelect(country._id)}
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
