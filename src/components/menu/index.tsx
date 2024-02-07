import {memo, FC} from "react"
import {cn as bem} from "@bem-react/classname"
import {Link} from "react-router-dom"
import './style.css'

interface MenuItem {
  key: number
  link: string
  title: string
}

interface MenuProps {
  items: MenuItem[]
  onNavigate: (item: MenuItem) => void
}

const Menu: FC<MenuProps> = ({ items = [], onNavigate}) => {
  const cn = bem('Menu')
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

export default memo(Menu)
