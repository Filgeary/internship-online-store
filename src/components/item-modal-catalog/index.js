import {memo, useState} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import './style.css';

function ItemModalCatalog(props){

  const cn = bem('Item');

  const callbacks = {
    onAdd: (_) => {
      props.onAdd(props.item._id)
    },
  }

  return (
    <div className={props.selected ? "Item Item_selected": "Item"} onClick={callbacks.onAdd}>
      <div className={cn('title')}>
        {props.item.title}
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
      </div>
    </div>
  );
}

ItemModalCatalog.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number
  }).isRequired,
  onAdd: PropTypes.func,
  selected: PropTypes.bool,
  labelAdd: PropTypes.string
};

ItemModalCatalog.defaultProps = {
  onAdd: () => {},
  labelCurr: '₽',
  labelAdd: 'Добавить'
}

export default memo(ItemModalCatalog);
