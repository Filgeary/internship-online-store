import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import { Link } from "react-router-dom";
import "./style.css";

type TNavigateItem = {
  key: number;
  link: string;
  title: string;
};

type TMenuProps = {
  items: TNavigateItem[];
  onNavigate: (item: { key: number; link: string; title: string }) => void;
};

function Menu({ items, onNavigate }: TMenuProps) {
  const cn = bem("Menu");
  return (
    <ul className={cn()}>
      {items.map((item) => (
        <li key={item.key} className={cn("item")}>
          <Link to={item.link} onClick={() => onNavigate(item)}>
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

Menu.defaultProps = {
  items: [],
  onNavigate: () => {},
}; 

export default memo(Menu);
