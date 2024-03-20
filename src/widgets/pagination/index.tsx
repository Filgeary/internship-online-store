import React, {memo} from 'react';
import {cn as bem} from '@bem-react/classname'
import './style.css';
import {PaginationProps} from "@src/widgets/pagination/types";



const Pagination: React.FC<PaginationProps> = ({page = 1, limit = 10, count = 1000, indent = 1, onChange, makeLink}) => {

    // Количество страниц
    const length = Math.ceil(count / Math.max(limit, 1));

    // Номера слева и справа относительно активного номера, которые остаются видимыми
    let left = Math.max(page - indent, 1);
    let right = Math.min(left + indent * 2, length);
    // Корректировка когда страница в конце
    left = Math.max(right - indent * 2, 1);

    // Массив номеров, чтобы удобней рендерить
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

    const onClickHandler: (e: React.MouseEvent, number: number | null) => void = (e, number) => {
        if (onChange && number) {
            e.preventDefault();
            onChange(number);
        }
    }

    const cn = bem('Pagination');
    return (
        <ul className={cn()}>
            {items.map((number, index) => (
                <li key={index}
                    className={cn('item', {active: number === page, split: !number})}
                    onClick={(e) => onClickHandler(e, number)}>
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
