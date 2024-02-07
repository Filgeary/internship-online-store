import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import { Link } from "react-router-dom";
import "./style.css";

interface IMenuProps {
  items: [
    {
      key: number;
      link: string;
      title: string;
    }
  ];
  onNavigate: (item: { key: number; link: string; title: string }) => void;
}
const Menu: React.FC<IMenuProps> = ({ items, onNavigate }) => {
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
};

export default memo(Menu);
