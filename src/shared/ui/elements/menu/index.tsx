import React, {memo} from "react";
import {cn as bem} from "@bem-react/classname";
import {Link} from "react-router-dom";
import './style.css';
import {MenuProps} from "@src/shared/ui/elements/menu/types";

const Menu: React.FC<MenuProps> = ({items, onNavigate}) => {
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
