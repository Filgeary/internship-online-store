import { FC, memo, useEffect, useState } from "react";
import { cn as bem } from "@bem-react/classname";
import { dateFormat } from "@src/utils/date-format";
import { MessagePropsType } from "./type";
import './style.css';
import { CheckIcon, DoubleCheckIcon } from "@src/components/icons/check";

const Message: FC<MessagePropsType> = ({ message, self, changeStatus }) => {
  const cn = bem("Message");

  const time = dateFormat(new Date(message.dateCreate));

  useEffect(() => {
    if(!self)
    changeStatus();
  }, [])

  return (
    <article className={cn({ self, notSelf: !self })}>
      {!self && <h5 className={cn("name")}>{message.author.username}</h5>}
      <div className={cn("text", { self, notSelf: !self })}>
        <p>{message.text}</p>
        <div className={cn("time")}>
          <span>{time}</span>
          {message.status === "sent" && self && <CheckIcon />}
          {message.status === 'read' && self && <DoubleCheckIcon />}
        </div>
      </div>
    </article>
  );
};

export default memo(Message)
