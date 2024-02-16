import { cn as bem } from '@bem-react/classname';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

export type TMenuItem = {
  key: number;
  link: string;
  title: string;
};

type Props = {
  items: TMenuItem[];
  onNavigate: (item: TMenuItem) => void;
};

function Menu({ items, onNavigate }: Props) {
  const cn = bem('Menu');

  return (
    <ul className={cn()}>
      {items.map(item => (
        <li
          key={item.key}
          className={cn('item')}
        >
          <Link
            to={item.link}
            onClick={() => onNavigate(item)}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default memo(Menu);
