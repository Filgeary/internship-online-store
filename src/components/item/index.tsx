import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import numberFormat from "@src/utils/number-format";
import './style.css';
import {Link} from "react-router-dom";
import {ArticleInterface} from "@src/types/ArticleInterface";

interface Props {
  item: ArticleInterface,
  link: string,
  onAdd: (item: ArticleInterface) => void,
  labelCurr?: string,
  labelAdd?: string
}

interface Callbacks {
  onAdd: (event: React.MouseEvent<HTMLButtonElement>) => void
}


const Item: React.FC<Props> = ({item, link, onAdd, labelCurr = '₽', labelAdd = 'Добавить'}) => {

  const cn = bem('Item');


  const callbacks: Callbacks = {
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
