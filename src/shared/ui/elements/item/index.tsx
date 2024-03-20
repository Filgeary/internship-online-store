import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.css';
import {Link} from "react-router-dom";
import numberFormat from "@src/shared/utils/number-format";
import {ItemCallbacks, ItemProps} from "@src/shared/ui/elements/item/types";



const Item: React.FC<ItemProps> = ({item, link, onAdd, labelCurr = '₽', labelAdd = 'Добавить'}) => {

  const cn = bem('Item');


  const callbacks: ItemCallbacks = {
    onAdd: (e) => onAdd(item),
  }

  return (
    <div className={cn()}>
      {/*<div className={cn('code')}>{props.item._id}</div>*/}
      <div className={cn('title')}>
        <Link to={link}>{item.title}</Link>
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(item.price)} {labelCurr}</div>
        <button onClick={callbacks.onAdd}>{labelAdd}</button>
      </div>
    </div>
  );
}

export default memo(Item);
