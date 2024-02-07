import { cn as bem } from "@bem-react/classname";
import { memo } from "react";
import { Link } from "react-router-dom";

import './style.css';

type Item = {
  key: number;
  link: string;
  title: string;
};

type Props = {
  items: Item[],
  onNavigate: (item: Item) => void
}

function Menu({ items, onNavigate }: Props) {
  const cn = bem('Menu');

  return (
    <ul className={cn()}>
      {items.map(item => (
        <li key={item.key} className={cn('item')}>
          <Link to={item.link} onClick={() => onNavigate(item)}>{item.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default memo(Menu);
