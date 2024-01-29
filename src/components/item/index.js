import './style.css';
import {memo, useState} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

import {cn as bem} from '@bem-react/classname';

import numberFormat from "@src/utils/number-format";

function Item(props){
  const cn = bem('Item');

  const options = {
    showAppendix: props.isSelectable && props.count > 0,
  };

  const callbacks = {
    onAdd: (e) => {
      e.stopPropagation();
      props.onAdd();
    },
  };

  const renders = {
    link: () => 
      props.isSelectable ? <span>{props.item.title}</span> : <Link to={props.link}>{props.item.title}</Link>,
  };

  return (
    <div onClick={props.onClick} className={cn({ selectable: props.isSelectable })}>
      <div className={cn('title')}>
        {renders.link()}
        {options.showAppendix && <span> | Будет добавлено: {props.count} шт.</span>}
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
    price: PropTypes.number,
    count: PropTypes.number,
  }).isRequired,
  link: PropTypes.string,
  onAdd: PropTypes.func,
  onClick: PropTypes.func,
  labelCurr: PropTypes.string,
  labelAdd: PropTypes.string,
  disabledAddBtn: PropTypes.bool,
  isSelectable: PropTypes.bool,
};

Item.defaultProps = {
  onAdd: () => {},
  onClick: () => {},
  labelCurr: '₽',
  labelAdd: 'Добавить',
  disabledAddBtn: false,
}

export default memo(Item);
