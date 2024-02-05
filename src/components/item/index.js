import {memo, useState} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import './style.css';
import {Link} from "react-router-dom";

function Item(props){

  const cn = bem('Item');

  const callbacks = {
    onOpenModal: (event) => {
      event.stopPropagation()
      props.onOpenModal(props.item._id)
    },
    handleClick: (event) => {
      event.stopPropagation()
      props.handleClickButton(props.item._id)
    }
  }
  
  return (
    <div className={cn({ selected: props.item.selectedGoods })} onClick={(event) => callbacks.handleClick(event)}>
      {/*<div className={cn('code')}>{props.item._id}</div>*/}
      <div className={cn('title')}>
        {props.hideLink ? (
          <Link to={props.link}>{props.item.title}</Link>
        ) : (
          <span>{props.item.title}</span>
        )}
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
        <button onClick={(event) => callbacks.onOpenModal(event)} disabled={props.disabled}>{props.labelAdd}</button>
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
  onOpenModal: PropTypes.func,
  deselect: PropTypes.func,
  labelCurr: PropTypes.string,
  labelAdd: PropTypes.string,
  hideLink: PropTypes.bool,
  handleClickButton: PropTypes.func
};

Item.defaultProps = {
  handleClickButton: () => {}, 
  onOpenModal: () => {},
  labelCurr: '₽',
  labelAdd: 'Добавить',
  hideLink: true
}

export default memo(Item);
