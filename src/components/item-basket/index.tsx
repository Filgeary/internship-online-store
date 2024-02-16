import React, {memo} from 'react';
import numberFormat from "@src/utils/number-format";
import {cn as bem} from "@bem-react/classname";
import {Link} from "react-router-dom";
import './style.css';
import {IArticle} from "../../../types/IArticle";


interface Props {
  item: IArticle,
  link: string,
  onLink: (value: any) => void,
  onRemove: (_id: string | number) => void,
  labelDelete: string,
  labelCurr?: string,
  labelUnit: string,
}

function ItemBasket ({item, link, onLink, onRemove, labelDelete = 'Удалить', labelCurr = '₽', labelUnit = 'шт'}: Props): React.JSX.Element {
  const cn = bem('ItemBasket');
  const callbacks = {
    onRemove: () => onRemove(item._id)
  };

  return (
    <div className={cn()}>
      {/*<div className={cn('code')}>{props.item._id}</div>*/}
      <div className={cn('title')}>
        {link
          ? <Link to={link} onClick={() => onLink}>{item.title}</Link>
          : item.title}
      </div>
      <div className={cn('right')}>
        <div className={cn('cell')}>{numberFormat(item.price)} {labelCurr}</div>
        <div className={cn('cell')}>{numberFormat(item.amount || 0)} {labelUnit}</div>
        <div className={cn('cell')}><button onClick={callbacks.onRemove}>{labelDelete}</button></div>
      </div>
    </div>
  )
}

export default memo(ItemBasket);
