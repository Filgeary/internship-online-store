import './style.css';

import { memo } from 'react'
import PropTypes from 'prop-types';

import { cn as bem } from '@bem-react/classname';

function ItemCatalogModal() {
  const cn = bem('ItemCatalogModal');

  const options = {
    showAppendix: props.isSelectable && props.count > 0,
    // selectable: props.isSelectable && !props.count,
    // block: props.count > 0,

    selectable: props.isSelectable,
    block: false,
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
        {options.showAppendix && <span> | Будет добавлено: {props.count} шт.</span>}
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
        <button onClick={props.onDelete}>
          {props.labelDelete}
        </button>
      </div>
    </div>
  );
}

ItemCatalogModal.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number,
    count: PropTypes.number,
  }).isRequired,
  link: PropTypes.string,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  labelCurr: PropTypes.string,
  isSelectable: PropTypes.bool,
};

ItemCatalogModal.defaultProps = {
  onAdd: () => {},
  onClick: () => {},
  onDelete: () => {},
  labelCurr: '₽',
  labelDelete: 'Удалить',
};

export default memo(ItemCatalogModal);