import { FC, memo } from "react";
import { cn as bem } from "@bem-react/classname";
import { dateFormat } from "@src/utils/date-format";
import { MessagePropsType } from "./type";
import './style.css';

const Message: FC<MessagePropsType> = (props) => {
  const cn = bem("Message");

  const time = dateFormat(new Date(props.message.dateCreate));

  return (
    <article className={cn({ self: props.self, notSelf: !props.self })}>
      {!props.self && <h5 className={cn('name')}>
        {props.message.author.username}
      </h5>}
      <div className={cn("text", { self: props.self, notSelf: !props.self })}>
        <p>{props.message.text}</p>
        <span
          className={cn("time", { self: props.self, notSelf: !props.self })}
        >
          {time}
        </span>
      </div>
    </article>
  );
};

export default memo(Message)
