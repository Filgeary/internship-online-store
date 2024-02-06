import './style.css';

import React, {memo} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

import {cn as bem} from '@bem-react/classname';

import numberFormat from "@src/utils/number-format";

type ItemProps = {
  item: TItem,
  link?: string;
  onAdd?: () => void;
  labelCurr?: string;
  labelAdd?: string;
};

const defaultProps: Omit<ItemProps, "item"> = {
  onAdd: () => {},
  labelCurr: '₽',
  labelAdd: 'Добавить',
};

Item.defaultProps = defaultProps;

function Item(props: ItemProps){
  const cn = bem('Item');

  const callbacks = {
    onAdd: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      props.onAdd();
    },
  };

  return (
    <div
      className={cn()}
    >
      <div className={cn('title')}>
        <Link to={props.link}>{props.item.title}</Link>
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>        
          <button
            onClick={callbacks.onAdd}
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

export default memo(Item);
