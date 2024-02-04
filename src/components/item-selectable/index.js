import './style.css';

import {memo} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

import {cn as bem} from '@bem-react/classname';

import numberFormat from "@src/utils/number-format";

function ItemSelectable(props){
  const cn = bem('ItemSelectable');

  const options = {
    selectable: !props.count,
    block: props.count > 0,
    
    showAppendix: props.count > 0,
    // selectable: true,
    // block: false,
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

  return (
    <div
      onClick={props.onClick}
      className={cn({ selectable: options.selectable, block: options.block })}
    >
      <div className={cn('title')}>
        <span>{props.item.title}</span>
        {options.showAppendix && <span> | {props.appendix(props.count)}</span>}
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
        {
          props.count && (
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

ItemSelectable.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number,
    count: PropTypes.number,
  }).isRequired,
  link: PropTypes.string,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  onAdd: PropTypes.func,
  labelCurr: PropTypes.string,
  labelDelete: PropTypes.string,
  count: PropTypes.number,
  appendix: PropTypes.func,
};

ItemSelectable.defaultProps = {
  onAdd: () => {},
  onClick: () => {},
  onDelete: () => {},
  appendix: () => {},
  labelCurr: '₽',
  labelDelete: 'Удалить',
};

export default memo(ItemSelectable);
