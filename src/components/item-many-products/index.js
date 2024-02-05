import {memo, useLayoutEffect, useState} from 'react';
import propTypes from 'prop-types';
import numberFormat from "@src/utils/number-format";
import {cn as bem} from "@bem-react/classname";
import PropTypes from "prop-types";
import Button from '../button';
import InputNumber from '../input-number';
import './style.css';

function ItemManyProducts(props) {
  // Кнопка, на которой отображается спиннер, пока диалоговое окно открыто.
  // Решает проблему связанную с исчезновением кнопки, когда открывается
  // диалоговое окно (кнопка отображается только когда мышка над плашкой).
  const [isShowButton, setIsShowButton] = useState(false);

  const cn = bem('ItemManyProducts');

  const selectedData = props.selectedItems.find(({ item }) => item._id === props.item._id);

  const callbacks = {
    // Кнопка "Изменить"
    onEdit: (e) => {
      e.stopPropagation();
      props.onEdit(props.item, selectedData.pcs);
    },
    // Клик для выделения товара
    onSelect: (e) => props.onSelectProduct(props.item),
    // Меняем количество на месте
    onEditPcs: value => props.onChangePcs(props.item._id, value),
    // Скрыть/показать кнопку
    setShow: val => e => {
      if (!props.clickedItem) setIsShowButton(val);
    },
  }

  useLayoutEffect(() => {
    // Когда диалоговое окно закроется, нужно скрыть кнопку с той плашки
    // на которой она была нажата
    if (!props.clickedItem) setIsShowButton(false)
  }, [props.clickedItem])

  // Кликнута кнопка чтобы открыть диалоговое окно, на кнопке спиннер
  const isClicked = props.item._id === props.clickedItem;

  // Стили
  // Плашка выбранного поля - зелённым
  const selected = Boolean(selectedData);
  // Плашка выбранного поля с ошибкой - красным
  const error = selected && !Boolean(selectedData?.pcs);

  return (
    <div className={cn({ selected, error })}
      onClick={callbacks.onSelect}
      onMouseEnter={callbacks.setShow(true)}
      onMouseLeave={callbacks.setShow(false)}
    >
      {/*<div className={cn('code')}>{props.item._id}</div>*/}
      <div className={cn('title')}>{props.item.title}</div>
      <div className={cn('right', {selected})}>
        { selectedData
          ? (<>
              <div className={cn('cellBig')}>
                {isShowButton && <Button onClick={callbacks.onEdit} value={props.labelEdit} isLoading={isClicked} />}
              </div>
              <div className={cn('cell')}>{numberFormat(props.item.price)} ₽</div>
              <div className={cn('cellMini')}>x</div>
              <InputNumber
                placeholder={'шт'}
                minValue={1}
                maxValue={9999}
                value={selectedData.pcs}
                updateValue={callbacks.onEditPcs}
              />
              <div className={cn('cellMini')}>=</div>
              <div className={cn('cellTotal')}>{numberFormat(selectedData.sum)} {props.labelCurr}</div>
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
  clickedItem: PropTypes.string,
  labelCurr: PropTypes.string,
  labelEdit: PropTypes.string,
  labelUnit: PropTypes.string,
}

ItemManyProducts.defaultProps = {
  onRemove: () => {},
  labelCurr: '₽',
  labelUnit: 'шт',
  labelDelete: 'Удалить',
}

export default memo(ItemManyProducts);
