import {memo} from "react";
import {cn as bem} from "@bem-react/classname";
import {Link} from "react-router-dom";
import { MenuPropsType } from "./types";
import './style.css';


function Menu({items, onNavigate}: MenuPropsType) {
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

// Menu.defaultProps = {
//   items: [],
//   onNavigate: () => {}
// }

export default memo(Menu);
