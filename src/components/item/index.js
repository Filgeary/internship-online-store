import './style.css';

import {memo} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

import {cn as bem} from '@bem-react/classname';

import numberFormat from "@src/utils/number-format";

function Item(props){
  const cn = bem('Item');

  const options = {
    showAppendix: props.isSelectable && props.count > 0,
    // selectable: props.isSelectable && !props.count,
    // block: props.count > 0,

    selectable: props.isSelectable,
    block: false,
  };

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

  const renders = {
    link: props.isSelectable ? <span>{props.item.title}</span> : <Link to={props.link}>{props.item.title}</Link>,
  };

  return (
    <div
      onClick={props.onClick}
      className={cn({ selectable: options.selectable, block: options.block })}
    >
      <div className={cn('title')}>
        {renders.link}
        {options.showAppendix && <span> | {props.appendix(props.count)}</span>}
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
        {
          !props.isSelectable && (
            <button
              onClick={callbacks.onAdd}
              disabled={props.disabledAddBtn}
            >
              {props.labelAdd}
            </button>
          )
        }

        {
          props.isDeletable && props.count && (
            <button
              onClick={callbacks.onDelete}
            >
              {props.labelDelete}
            </button>
          )
        }
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
  onDelete: PropTypes.func,
  labelCurr: PropTypes.string,
  labelAdd: PropTypes.string,
  labelDelete: PropTypes.string,
  disabledAddBtn: PropTypes.bool,
  isSelectable: PropTypes.bool,
  isDeletable: PropTypes.bool,
  count: PropTypes.number,
  appendix: PropTypes.func,
};

Item.defaultProps = {
  onAdd: () => {},
  onClick: () => {},
  onDelete: () => {},
  labelCurr: '₽',
  labelAdd: 'Добавить',
  labelDelete: 'Удалить',
  disabledAddBtn: false,
  isSelectable: false,
  isDeletable: false,
  appendix: () => {},
};

export default memo(Item);
