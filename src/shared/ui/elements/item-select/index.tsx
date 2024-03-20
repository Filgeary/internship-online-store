import React, {memo, useCallback, useEffect, useState} from 'react';
import {cn as bem} from "@bem-react/classname";
import './style.css';
import InputNumber from "@src/shared/ui/elements/input-number";
import numberFormat from "@src/shared/utils/number-format";
import {ItemSelectProps} from "@src/shared/ui/elements/item-select/types";

function ItemSelect({item, onSelect, select, labelCurr = '₽', labelAdd}: ItemSelectProps): React.ReactElement {
  const cn = bem('ItemSelect');

  // Создаю внутреннее состояние, которое будет отвечать за то выделен ли каждый элемент, так же при выделении будет появляться инпут для ввода количества
  const [selectLocal, setSelectLocal] = useState(!!select)
  // Количество каждого элемента, которое будет регулироваться инпутом
  const [quantity, setQuantity] = useState(select || 1)

  const callbacks = {
    // Функция навешивания селекта
    onSelect: useCallback(() => {
      setSelectLocal(prevState => !prevState)
    }, [selectLocal]),
  }

  useEffect(() => {
    // Каждый раз при изменении количества или при выделении (или отмене выделения) результат будет передаваться в компонент листа, непосредственно там будет создаваться список выделенных товаров, компонент отвечает только за передачу выбранных товаров "выше"
    onSelect(item._id, quantity, selectLocal)
  }, [quantity, selectLocal]);

  return (
    <div className={'ItemSelect ' + (!selectLocal ? cn() : cn('selected'))}>
      <div className={cn('title')} onClick={() => callbacks.onSelect()}>{item.title}</div>
      {selectLocal ? <InputNumber name={'SelectedList'} onChange={setQuantity} value={String(quantity)}/> : <></>}
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(item.price)} {labelCurr}</div>
      </div>
    </div>
  );
}

export default memo(ItemSelect);
