import React, {memo, useCallback, useEffect, useState} from 'react';
import {cn as bem} from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import './style.css';
import InputNumber from "@src/components/input-number";
import {ArticleInterface} from "../../../types/ArticleInterface";

interface Props {
  item: ArticleInterface,
  onSelect: (_id: number | string, quantity: number, select: boolean) => void,
  labelCurr?: string,
  labelAdd: string,
  select: number
}

function ItemSelect ({item, onSelect, select, labelCurr = '₽', labelAdd}: Props): React.ReactElement {
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
