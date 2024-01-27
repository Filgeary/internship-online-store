import {memo, useState} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import './style.css';
import {Link} from "react-router-dom";

function Item(props){

  const cn = bem('Item');

  const callbacks = {
    onAdd: () => props.onAdd(props.item),
  };

  return (
    <div className={cn()}>
      <div className={cn('title')}>
        <Link to={props.link}>{props.item.title}</Link>
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
        <button
          onClick={callbacks.onAdd}
          disabled={props.disabledAddBtn}
        >
          {props.labelAdd}
        </button>
      </div>
    </div>
  );
}

Item.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number
  }).isRequired,
  link: PropTypes.string,
  onAdd: PropTypes.func,
  labelCurr: PropTypes.string,
  labelAdd: PropTypes.string,
  disabledAddBtn: PropTypes.bool,
};

Item.defaultProps = {
  onAdd: () => {},
  labelCurr: '₽',
  labelAdd: 'Добавить',
  disabledAddBtn: false,
}

export default memo(Item);
