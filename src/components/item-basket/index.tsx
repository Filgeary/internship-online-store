import {memo, useCallback} from 'react';
import propTypes from 'prop-types';
import numberFormat from "@src/utils/number-format";
import {cn as bem} from "@bem-react/classname";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import './style.css';

export interface ItemType {
  _id: string;
  title: string;
  price: number;
  amount?: number;
}

interface ItemBasketProps {
  item: ItemType,
  link: string,
  onLink: () => void,
  onRemove: (_id: string) => void,
  labelCurr: string,
  labelDelete: string,
  labelUnit: string,
}

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

ItemBasket.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number,
    amount: PropTypes.number
  }).isRequired,
  link: PropTypes.string,
  onLink: PropTypes.func,
  onRemove: PropTypes.func,
  labelCurr: PropTypes.string,
  labelDelete: PropTypes.string,
  labelUnit: PropTypes.string,
}

export default memo(ItemBasket);
