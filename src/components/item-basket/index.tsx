import React, {memo} from 'react';
import numberFormat from "@src/utils/number-format";
import {cn as bem} from "@bem-react/classname";
import {Link} from "react-router-dom";
import './style.css';
import { TItem } from '@src/types/item';

type ItemBasketProps = {
  item: TItem;
  link: string;
  onLink: () => void;
  onRemove: (id: string) => void;
  labelCurr: string;
  labelDelete: string;
  labelUnit: string;
};

const defaultProps: Omit<ItemBasketProps, "item" | "link"> = {
  onLink: () => {},
  onRemove: () => {},
  labelCurr: '₽',
  labelUnit: 'шт',
  labelDelete: 'Удалить',
};

ItemBasket.defaultProps = defaultProps;

function ItemBasket(props: ItemBasketProps) {

  const cn = bem('ItemBasket');

  const callbacks = {
    onRemove: () => props.onRemove(props.item._id)
  };

  return (
    <div className={cn()}>
      <div className={cn('title')}>
        {props.link
          ? <Link to={props.link} onClick={props.onLink}>{props.item.title}</Link>
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

export default memo(ItemBasket);
