import { useState, MouseEvent, useRef } from "react";
import { cn as bem } from "@bem-react/classname";
import ItemCountry from "../item-country";
import { DropdownSelectedProps } from "./type";
import { useClickOutside } from "@src/hooks/use-click-outside";
import "./style.css";
import { checkPosition } from "@src/utils/check-position";

export default function DropdownSelected(props: DropdownSelectedProps) {
  const cn = bem("DropdownSelected");

  const [show, setShow] = useState(false);
  const moreRef = useClickOutside<HTMLUListElement>(() => setShow(false));
  const moreButtonRef = useRef<HTMLDivElement>(null);
  const position = checkPosition(moreButtonRef, moreRef.current?.clientHeight);

  if (!props.selected.length) {
    return <ItemCountry title={"Все"} />;
  }

  const amountForShow = props.open ? props.selected.length : 7;

  const callbacks = {
    onShow: (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setShow(!show);
    },
    onRemove: (e: React.MouseEvent<HTMLDivElement>, _id: string) => {
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
          className={props.selected.length === 1 ? cn() : ""}
        >
          <ItemCountry
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              callbacks.onRemove(e, country._id)
            }
            code={country.code}
            title={props.selected.length === 1 ? country.title : ""}
          />
        </li>
      ))}
      {props.selected.length - amountForShow > 0 && (
        <div
          className={cn("more")}
          onClick={(e: MouseEvent<HTMLDivElement>) => callbacks.onShow(e)}
          ref={moreButtonRef}
        >
          +{props.selected.length - amountForShow}
        </div>
      )}
      {props.selected.length - amountForShow > 0 && show && (
        <ul className={cn("menu", {position})} ref={moreRef}>
          {props.selected.slice(amountForShow).map((country) => (
            <li key={country.code} title={country.title}>
              <ItemCountry
                code={country.code}
                onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                  callbacks.onRemove(e, country._id)
                }
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
