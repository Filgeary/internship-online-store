import { useState, MouseEvent, useEffect, useRef } from "react";
import { cn as bem } from "@bem-react/classname";
import ItemCountry from "../item-country";
import { DropdownSelectedProps } from "./type";
import "./style.css";

export default function DropdownSelected(props: DropdownSelectedProps) {
  const cn = bem("DropdownSelected");

  const [show, setShow] = useState(false);
  const moreRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickOutside = (event: Event) => {
    if (
      moreRef.current &&
      !moreRef.current.contains(event.target as Node)
    ) {
      setShow(false);
    }
  };

  if (!props.selected.length) {
    return <ItemCountry title={"Все"} />;
  }

  const amountForShow = props.open ? props.selected.length : 7;

  const callbacks = {
    onShow: (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setShow(!show);
    },
    onRemove: (e: React.MouseEvent<HTMLLIElement>, _id: string) => {
      props.removeSelectedItem(_id, e);
      if (!(props.selected.length - amountForShow)) {
        setShow(false);
      }
    },
  };

  return (
    <>
      {props.selected.slice(0, amountForShow).map((country) => (
        <li
          key={country.code}
          title={country.title}
          onClick={(e: React.MouseEvent<HTMLLIElement>) =>
            props.removeSelectedItem(country._id, e)
          }
          className={props.selected.length === 1 ? cn() : ""}
        >
          <ItemCountry
            code={country.code}
            title={props.selected.length === 1 ? country.title : ""}
          />
        </li>
      ))}
      {props.selected.length - amountForShow > 0 && (
        <div className={cn("more")} onClick={(e:
        MouseEvent<HTMLDivElement>) => callbacks.onShow(e)}>
          +{props.selected.length - amountForShow}
        </div>
      )}
      {props.selected.length - amountForShow > 0 && show && (
        <ul className={cn("menu")} ref={moreRef}>
          {props.selected.slice(amountForShow).map((country) => (
            <li
              key={country.code}
              title={country.title}
              onClick={(e: React.MouseEvent<HTMLLIElement>) => callbacks.onRemove(e, country._id)}
            >
              <ItemCountry code={country.code} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
