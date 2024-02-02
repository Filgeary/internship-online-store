import './style.css';

import {memo} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

import {cn as bem} from '@bem-react/classname';

import numberFormat from "@src/utils/number-format";

function Item(props){
  const cn = bem('Item');

  const callbacks = {
    onAdd: (e) => {
      e.stopPropagation();
      props.onAdd();
    },

    onDelete: (e) => {
      e.stopPropagation();
      props.onDelete();
    },
  };

  return (
    <div
      onClick={props.onClick}
      className={cn()}
    >
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
    price: PropTypes.number,
    count: PropTypes.number,
  }).isRequired,
  link: PropTypes.string,
  onAdd: PropTypes.func,
  labelCurr: PropTypes.string,
  labelAdd: PropTypes.string,
};

Item.defaultProps = {
  onAdd: () => {},
  onClick: () => {},
  labelCurr: '₽',
  labelAdd: 'Добавить',
};

export default memo(Item);
