import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import "./style.css";
import { Link } from "react-router-dom";

type ItemSelectableProps = {
  item: {
    _id: string;
    title: string;
    price: number;
  };
  link: string;
  labelCurr: string;
  labelAdd: string;
  selected: boolean;
  selectItem: () => void;
};

function ItemSelectable(props: ItemSelectableProps) {
  const cn = bem("Item");

  return (
    <div
      className={props.selected ? cn("selected") : cn()}
      onClick={props.selectItem}
    >
      <div className={cn("title")}>
        <Link to={props.link}>{props.item.title}</Link>
      </div>
      <div className={cn("actions")}>
        <div className={cn("price")}>
          {numberFormat(props.item.price)} {props.labelCurr}
        </div>
      </div>
    </div>
  );
}

ItemSelectable.defaultProps = {
  onAdd: () => {},
  labelCurr: "₽",
  labelAdd: "Добавить",
};

export default memo(ItemSelectable);
