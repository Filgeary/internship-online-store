import { cn as bem } from '@bem-react/classname';
import { memo } from 'react';

import './style.css';

type Props = {
  onChange: (number: number) => void;
  makeLink: (number: number) => string;
  page?: number;
  limit?: number;
  count?: number;
  indent?: number;
}

function Pagination({
  onChange,
  makeLink,
  page = 1,
  limit = 10,
  count = 1000,
  indent = 1
}: Props) {
  const cn = bem('Pagination');

  // Количество страниц
  const length = Math.ceil(count / Math.max(limit, 1));

  // Номера слева и справа относительно активного номера, которые остаются видимыми
  let left = Math.max(page - indent, 1);
  let right = Math.min(left + indent * 2, length);
  // Корректировка когда страница в конце
  left = Math.max(right - indent * 2, 1);

  // Массив номеров, чтобы удобней отображать
  let items = [];
  // Первая страница всегда нужна
  if (left > 1) items.push(1);
  // Пропуск
  if (left > 2) items.push(null);
  // Последовательность страниц
  for (let page = left; page <= right; page++) items.push(page);
  // Пропуск
  if (right < length - 1) items.push(null);
  // Последняя страница
  if (right < length) items.push(length);

  const handleClick = (number: number) => (e: any) => {
    if (onChange) {
      e.preventDefault();
      onChange(number);
    }
  }

  return (
    <ul className={cn()}>
      {items.map((number, index) => (
        <li key={index}
          className={cn('item', { active: number === page, split: !number })}
          onClick={handleClick(number ?? 0)}>
          {number
            ? (makeLink
              ? <a href={makeLink(number)}>{number}</a>
              : number
            )
            : '...'
          }
        </li>
      ))}
    </ul>
  )
}

export default memo(Pagination);
