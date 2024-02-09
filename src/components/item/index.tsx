import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import "./style.css";
import { Link } from "react-router-dom";

type ItemProps = {
  item: {
    _id: string;
    title: string;
    price: number;
  };
  link: string;
  onAdd: (itemId: string, title: string) => void;
  labelCurr: string;
  labelAdd: string;
};

function Item(props: ItemProps) {
  const cn = bem("Item");

  const callbacks = {
    onAdd: () => props.onAdd(props.item._id, props.item.title),
  };

  return (
    <div className={cn()}>
      <div className={cn("title")}>
        <Link to={props.link}>{props.item.title}</Link>
      </div>
      <div className={cn("actions")}>
        <div className={cn("price")}>
          {numberFormat(props.item.price)} {props.labelCurr}
        </div>
        <button onClick={callbacks.onAdd}>{props.labelAdd}</button>
      </div>
    </div>
  );
}

Item.defaultProps = {
  onAdd: () => {},
  labelCurr: "₽",
  labelAdd: "Добавить",
};

export default memo(Item);
