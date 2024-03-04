import { memo, FC } from "react"
import { cn as bem } from "@bem-react/classname"

import "./style.css"

interface IChatButtonProps {
  onLastMessage: () => void
  clearChat: () => void
  onNewMessage: () => void
}
const ChatButton: FC<IChatButtonProps> = ({
  onLastMessage,
  clearChat,
  onNewMessage,
}) => {
  const cn = bem("Buttons")
  return (
    <div className={cn("wrap-button")}>
      <button
        className={cn("button", { button_bottom: true })}
        onClick={onLastMessage}
      >
        Старые сообщения
      </button>
      <button
        className={cn("button", { button_bottom: true })}
        onClick={clearChat}
      >
        Очистить чат
      </button>
      <button
        className={cn("button", { button_bottom: true })}
        onClick={onNewMessage}
      >
        Новые сообщения
      </button>
    </div>
  )
}

export default memo(ChatButton)
