import {memo, useState} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import './style.css';
import {Link} from "react-router-dom";

function ItemCatalogModal(props){

  const cn = bem('ItemCatalogModal');

  const callbacks = {
    onSelect: (e) => props.onSelect(props.item._id),
  }

  return (
    <div className={cn({selected: props.isSelected})} onClick={callbacks.onSelect}>
      {/*<div className={cn('code')}>{props.item._id}</div>*/}
      <div className={cn('title')}>
        <Link to={props.link}>{props.item.title}</Link>
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
      </div>
    </div>
  );
}

ItemCatalogModal.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number
  }).isRequired,
  link: PropTypes.string,
  onSelect: PropTypes.func,
  labelCurr: PropTypes.string,
  labelAdd: PropTypes.string,
  isSelected: PropTypes.bool
};

ItemCatalogModal.defaultProps = {
  onSelect: () => {},
  labelCurr: '₽',
  labelAdd: 'Добавить'
}

export default memo(ItemCatalogModal);
