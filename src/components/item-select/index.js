import React, {memo, useCallback, useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {cn as bem} from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";

import './style.css';
import InputNumber from "@src/components/input-number";

function ItemSelect(props) {
  const cn = bem('ItemSelect');

  // Создаю внутреннее состояние, которое будет отвечать за то выделен ли каждый элемент, так же при выделении будет появляться инпут для ввода количества
  const [select, setSelect] = useState(!!props.select)
  // Количество каждого элемента, которое будет регулироваться инпутом
  const [quantity, setQuantity] = useState(props.select || 1)

  const callbacks = {
    // Функция навешивания селекта
    onSelect: useCallback((e) => {
      setSelect(prevState => !prevState)
    }, [select]),
  }

  useEffect(() => {
    // Каждый раз при изменении количества или при выделении (или отмене выделения) результат будет передаваться в компонент листа, непосредственно там будет создаваться список выделенных товаров, компонент отвечает только за передачу выбранных товаров "выше"
    props.onSelect(props.item._id, quantity, select)
  }, [quantity, select]);

  return (
    <div className={'ItemSelect ' + (!select ? cn() : cn('selected'))}>
      <div className={cn('title')} onClick={callbacks.onSelect}>{props.item.title}</div>
      {select ? <InputNumber onChange={setQuantity} value={String(quantity)}/> : <></>}
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
      </div>
    </div>
  );
}

ItemSelect.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number
  }).isRequired,
  onSelect: PropTypes.func,
  labelCurr: PropTypes.string,
  select: PropTypes.number
};

ItemSelect.defaultProps = {
  onSelect: () => {
  },
  labelCurr: '₽',
}

export default memo(ItemSelect);
