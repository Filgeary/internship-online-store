import {memo} from "react";
import {cn as bem} from "@bem-react/classname";
import {Link} from "react-router-dom";
import './style.css';

interface IItem {
  key: number,
  link: string,
  title: string,
}

interface MenuProps {
  items: IItem[],
  onNavigate: (item: IItem) => void
}

function Menu({items, onNavigate}: MenuProps) {
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
