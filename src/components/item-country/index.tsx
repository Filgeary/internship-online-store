import { cn as bem } from "@bem-react/classname";
import { ItemCountryProps } from "./type";
import './style.css';

function ItemCountry(props: ItemCountryProps) {
  const cn = bem("ItemCountry");

  return (
    <>
      <div className={cn("code")} onClick={props.onClick}>{props.code}</div>
      <span>{props.title}</span>
    </>
  );
}

export default ItemCountry;
