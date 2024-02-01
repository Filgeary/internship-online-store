import {memo, useCallback} from 'react';
import propTypes from 'prop-types';
import numberFormat from "@src/utils/number-format";
import {cn as bem} from "@bem-react/classname";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import './style.css';
import Button from '../button';

function ItemManyProducts(props) {

  const cn = bem('ItemManyProducts');

  // Кликнута кнопка чтобы открыть диалоговое окно, на кнопке спиннер
  const isClicked = props.item._id === props.clickedItem;

  const selectedData = props.selectedItems.find(({ item }) => item._id === props.item._id);

  const callbacks = {
    onEdit: (e) => {
      e.stopPropagation();
      props.onEdit(props.item, selectedData.pcs || 1)
    },
    onSelect: (e) => props.onSelectProduct(props.item),
    // onAdd: (e) => props.onAdd(props.item._id),
  }

  return (
    <div className={cn({selected: Boolean(selectedData)})} onClick={callbacks.onSelect}>
      {/*<div className={cn('code')}>{props.item._id}</div>*/}
      <div className={cn('title')}>{props.item.title}</div>
      <div className={cn('right')}>
        { selectedData
          ? (<>
              <div className={cn('cellBig')}>
                <Button onClick={callbacks.onEdit} value={props.labelEdit} isLoading={isClicked} />
              </div>
              <div className={cn('cell')}>
                {numberFormat(props.item.price)} {props.labelCurr} x {numberFormat(selectedData.pcs || 1)} {props.labelUnit} =
              </div>
              <div className={cn('cell')}><b>{numberFormat(selectedData.sum)}</b> {props.labelCurr}</div>
            </>)
          : <div className={cn('cell')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
        }

      </div>
    </div>
  )
}

ItemManyProducts.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number,
    amount: PropTypes.number
  }).isRequired,
  link: PropTypes.string,
  onLink: PropTypes.func,
  onRemove: PropTypes.func,
  labelCurr: PropTypes.string,
  labelDelete: PropTypes.string,
  labelUnit: PropTypes.string,
}

ItemManyProducts.defaultProps = {
  onRemove: () => {},
  labelCurr: '₽',
  labelUnit: 'шт',
  labelDelete: 'Удалить',
}

export default memo(ItemManyProducts);
