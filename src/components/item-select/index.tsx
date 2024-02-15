import {memo} from 'react';
import numberFormat from "@src/utils/number-format";
import {cn as bem} from "@bem-react/classname";
import PropTypes from "prop-types";
import type { ItemSelectProps } from './types';
import './style.css';

function ItemSelect(props: ItemSelectProps) {

  const cn = bem('ItemSelect');

  const callbacks = {
    onClick: () => props.onClick(props.item._id),
  }

  return (
    <div className={cn({selected: String(props.selected)})} onClick={callbacks.onClick}>
      <div className={cn('title')}>
        {props.item.title}
      </div>
      <div className={cn('right')}>
        <div className={cn('cell')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
      </div>
    </div>
  )
}

ItemSelect.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number,
    amount: PropTypes.number
  }).isRequired,
  onClick: PropTypes.func,
  labelCurr: PropTypes.string,
  labelUnit: PropTypes.string,
  selected: PropTypes.bool
}

ItemSelect.defaultProps = {
  onClick: () => {},
  labelCurr: '₽',
  labelUnit: 'шт',
  selected: false
}

export default memo(ItemSelect);
