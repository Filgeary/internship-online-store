import { cn as bem } from '@bem-react/classname';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import type { IArticle } from '@src/types/IArticle';
import numberFormat from '@src/utils/number-format';

import './style.css';

type Props = {
  item: IArticle;
  link: string;
  onAdd: (id: string | number) => void;
  labelCurr?: string;
  labelAdd?: string;
};

function Item({ item, link, onAdd, labelCurr = '₽', labelAdd = 'Добавить' }: Props) {
  const cn = bem('Item');

  const callbacks = {
    onAdd: () => onAdd(item._id),
  };

  return (
    <div className={cn()}>
      <div className={cn('title')}>
        <Link to={link}>{item.title}</Link>
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>
          {numberFormat(item.price)} {labelCurr}
        </div>
        <button onClick={callbacks.onAdd}>{labelAdd}</button>
      </div>
    </div>
  );
}

export default memo(Item);
