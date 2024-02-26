import { FC } from "react";
import { cn as bem } from "@bem-react/classname";
import { Message } from "./message";
import { MessagesPropType } from "./type";
import './style.css';

export const Messages: FC<MessagesPropType> = ({messages, userId}) => {
  const cn = bem("Messages");
  return (
    <div className={cn()}>
      <div className={cn('content')}>
        {messages.map((msg) => (
          <Message
            key={msg._key}
            message={msg}
            self={userId === msg.author._id}
          />
        ))}
      </div>
    </div>
  );
};
