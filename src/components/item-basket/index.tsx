import { cn as bem } from "@bem-react/classname";
import { memo } from 'react';
import { Link } from "react-router-dom";

import type { IArticle } from '@src/types/IArticle';
import numberFormat from "@src/utils/number-format";

import './style.css';

interface IArticleItemBasket extends IArticle {
  amount: number
}

type Props = {
  item: IArticleItemBasket,
  link: string,
  onLink: () => void,
  onRemove: (id: string | number) => void
  labelCurr?: string,
  labelUnit?: string,
  labelDelete?: string,
}

function ItemBasket({
  item,
  link,
  onLink,
  onRemove,
  labelCurr = '₽',
  labelUnit = 'шт',
  labelDelete = 'Удалить'
}: Props) {
  const cn = bem('ItemBasket');

  const callbacks = {
    onRemove: () => onRemove(item._id)
  };

  return (
    <div className={cn()}>
      <div className={cn('title')}>
        {link
          ? <Link to={link} onClick={onLink}>{item.title}</Link>
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
