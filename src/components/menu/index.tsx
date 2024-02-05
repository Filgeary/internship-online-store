import {memo} from "react";
import {cn as bem} from "@bem-react/classname";
import {Link} from "react-router-dom";
import './style.css';

type MenuProps = {
  items: Array<{ key: number; link: string; title: string }>;
  onNavigate: (elem: { key: number; link: string; title: string }) => void;
};

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
