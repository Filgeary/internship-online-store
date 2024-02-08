import {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import {Link} from "react-router-dom";
import type { ItemProps } from "./type";
import './style.css';

function Item(props: ItemProps){

  const cn = bem('Item');

  const callbacks = {
    onAdd: () => props.onAdd(props.item._id),
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

export default memo(Item);
