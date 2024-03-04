import { memo, FC } from "react"
import { cn as bem } from "@bem-react/classname"

import "./style.css"

interface IMessageFontProps {
    onClickBold: () => void
    onClickNormal: () => void
}
const MessageFont: FC<IMessageFontProps> = ({onClickBold, onClickNormal}) => {
  const cn = bem("Font")
  return (
    <ul className={cn()}>
      <li className={cn("normal")} onClick={onClickNormal}>Нормальный</li>
      <li className={cn("bold")} onClick={onClickBold}>Жирный</li>
    </ul>
  )
}

export default memo(MessageFont)