import { memo } from "react";
import numberFormat from "@src/utils/number-format";
import { cn as bem } from "@bem-react/classname";
import { Link } from "react-router-dom";
import "./style.css";

interface ItemBasketProps {
  item: {
    _id: string;
    title: string;
    price: number;
    amount: number;
  };
  link: string;
  onLink: () => void;
  onRemove: (_id: string) => void;
  labelCurr: string;
  labelDelete: string;
  labelUnit: string;
}

function ItemBasket({
  onRemove = () => {},
  labelCurr = "₽",
  labelUnit = "шт",
  labelDelete = "Удалить",
  ...props
}: ItemBasketProps) {
  const cn = bem("ItemBasket");

  const callbacks = {
    onRemove: () => onRemove(props.item._id),
  };

  return (
    <div className={cn()}>
      {/*<div className={cn('code')}>{props.item._id}</div>*/}
      <div className={cn("title")}>
        {props.link ? (
          <Link to={props.link} onClick={props.onLink}>
            {props.item.title}
          </Link>
        ) : (
          props.item.title
        )}
      </div>
      <div className={cn("right")}>
        <div className={cn("cell")}>
          {numberFormat(props.item.price)} {labelCurr}
        </div>
        <div className={cn("cell")}>
          {numberFormat(props.item.amount || 0)} {labelUnit}
        </div>
        <div className={cn("cell")}>
          <button onClick={callbacks.onRemove}>{labelDelete}</button>
        </div>
      </div>
    </div>
  );
}

export default memo(ItemBasket);
