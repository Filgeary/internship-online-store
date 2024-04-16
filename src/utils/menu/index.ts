import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon"
import generateUniqueId from "../unicque_id"
import { InputRef, SearchProps } from "antd/es/input"

interface IMenuProps {
// map(arg0: (child: IMenuProps) => any): any
icon?: React.ReactNode
label: string
children?: any
key?: string
}

const menu = (items: IMenuProps[]) => {

    const generateMenu = (item: IMenuProps): any => {
        const { icon, label, children, key } = item
        const menuItem: any = {
          key: key ? key : generateUniqueId(),
          label,
        }
    
        if (icon) {
          menuItem.icon = icon
        }
    
        if (children && children.length > 0) {
          menuItem.children = children.map((child: IMenuProps) => generateMenu(child))
        }
    
        return menuItem
      }
    
      return items.map(generateMenu)
}

export default menu