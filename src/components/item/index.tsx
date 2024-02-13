import { memo, MouseEvent } from "react";
import {cn as bem} from '@bem-react/classname';
import numberFormat from "../../utils/number-format";
import {Link} from "react-router-dom";
import { ItemPropsType } from "./types";
import './style.css';

function Item(props: ItemPropsType){

  const cn = bem('Item');

  const callbacks = {
    onAdd: (e: MouseEvent<HTMLButtonElement>) => props.onAdd(props.item._id, props.item.title),
  }

  return (
    <div className={cn()}>
      {/*<div className={cn('code')}>{props.item._id}</div>*/}
      <div className={cn('title')}>
        <Link to={props.link}>{props.item.title}</Link>
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
        <button onClick={callbacks.onAdd}>{props.labelAdd}</button>
      </div>
    </div>
  );
}

// Item.defaultProps = {
//   onAdd: () => {},
//   labelCurr: '₽',
//   labelAdd: 'Добавить'
// }

export default memo(Item);
