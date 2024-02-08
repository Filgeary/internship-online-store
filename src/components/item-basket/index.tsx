import React, {memo} from 'react';
import numberFormat from "@src/utils/number-format";
import {cn as bem} from "@bem-react/classname";
import {Link} from "react-router-dom";
import './style.css';

interface Item {
  _id: string | number,
  price: number,
  title: string
  amount: number
}

interface Props {
  item: Item,
  link: string,
  onLink: (value: any) => void,
  onRemove: (_id: string | number) => void,
  labelDelete: string,
  labelCurr: string,
  labelUnit: string,
}

const ItemBasket: React.FC<Props> = (props) => {

  const cn = bem('ItemBasket');

  const callbacks = {
    onRemove: (e: React.MouseEvent<HTMLButtonElement>) => props.onRemove(props.item._id)
  };

  return (
    <div className={cn()}>
      {/*<div className={cn('code')}>{props.item._id}</div>*/}
      <div className={cn('title')}>
        {props.link
          ? <Link to={props.link} onClick={() => props.onLink}>{props.item.title}</Link>
          : props.item.title}
      </div>
      <div className={cn('right')}>
        <div className={cn('cell')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
        <div className={cn('cell')}>{numberFormat(props.item.amount || 0)} {props.labelUnit}</div>
        <div className={cn('cell')}><button onClick={callbacks.onRemove}>{props.labelDelete}</button></div>
      </div>
    </div>
  )
}

ItemBasket.defaultProps = {
  onRemove: () => {},
  labelCurr: '₽',
  labelUnit: 'шт',
  labelDelete: 'Удалить',
}

export default memo(ItemBasket);
