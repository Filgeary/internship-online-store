import React, {memo} from "react";
import {cn as bem} from "@bem-react/classname";
import {Link} from "react-router-dom";
import './style.css';

/*
Menu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number,
    link: PropTypes.string,
    title: PropTypes.string,
  })),
  onNavigate: PropTypes.func
}

Menu.defaultProps = {
  items: [],
  onNavigate: () => {}
}
 */

interface Item {
  key: string | number,
  title: string,
  link: string
}

interface Props {
  items: Item[],
  onNavigate: (item: Item) => void
}

const Menu: React.FC<Props> = ({items, onNavigate}) => {
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
