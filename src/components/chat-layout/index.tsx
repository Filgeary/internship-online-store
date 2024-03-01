import React, { memo } from "react"
import { cn as bem } from "@bem-react/classname"
import Input from "@src/components/input"
import { IChat } from "@src/store/chat/types"
import Img from "../../assets/images/avatar.png"
import "./style.css";

interface IChatLayout {
  onMessage: () => void
  onChange: (value: string, name: string | undefined) => void
  onLastMessage: () => void
  onNewMessage: () => void
  clearChat: () => void
  value: string
  messages: IChat[]
  name: string
  statusClearChat: boolean
}

const ChatLayout = React.forwardRef<HTMLDivElement, IChatLayout>((props, ref) =>  {
    const {
        onMessage,
        onChange,
        onLastMessage,
        onNewMessage,
        clearChat,
        value,
        messages,
        name,
        statusClearChat
      } = props
  const cn = bem("Chat")

  return (
    <div className={cn()}>
        {statusClearChat && <p className={cn("title")}>Сообщения удалены</p>}
        {messages.length < 1 && <p className={cn("title")}>Время ожидания сообщений</p>}
        {messages?.map((item, index) => (
          <div 
          className={cn("wrap-message", { right: item.author.username === name})} 
          key={item._id}
          ref={ref}>
            <div className={cn("message")}>
                <img className={cn("img")} src={Img} alt='Avatar'></img>
              <div className={cn("text")}>{item.text}</div>
              <div className={cn("wrap-check")}>
                <div className={cn("wrap_1")}>
                  <span id="check-part-1" className={cn("check")}></span>
                  <span id="check-part-2" className={cn("check")}></span>
                </div>
                <div className={cn("wrap_2")}>
                  <span id="check-part-1" className={cn("check")}></span>
                  <span id="check-part-2" className={cn("check")}></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      <div className={cn("input")}>
        <Input
          name="message"
          value={value}
          onChange={onChange}
          theme={"message"}
          placeholder="Написать сообщение..."
        />
        <div>
          <button className={cn("button")} onClick={onMessage}>
            Отправить
          </button>
        </div>
      </div>
      <div className={cn("wrap-button")}>
        <button className={cn("button", {button_bottom: true})} onClick={onLastMessage}>
            Старые сообщения
        </button>
        <button className={cn("button", {button_bottom: true})} onClick={clearChat}>
            Очистить чат
        </button>
        <button className={cn("button", {button_bottom: true})} onClick={onNewMessage}>
            Новые сообщения
        </button>
      </div>
    </div>
  );
});

export default memo(ChatLayout);
