import { FC, useEffect, useRef, useState } from "react";
import { cn as bem } from "@bem-react/classname";
import Message from "./message";
import { ChevronDown } from "../icons/arrow/arrow";
import { MessagesPropType } from "./type";
import "./style.css";

export const Messages: FC<MessagesPropType> = ({ messages, userId }) => {
  const cn = bem("Messages");
  const [autoScroll, setAutoscroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    if (
      Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight
      ) < 200
    ) {
      !autoScroll && setAutoscroll(true);
    } else {
      autoScroll && setAutoscroll(false);
    }
  };

  return (
    <div className={cn()}>
      <div className={cn("content")} onScroll={scrollHandler}>
        {messages.map((msg) => (
          <Message
            key={msg._key}
            message={msg}
            self={userId === msg.author._id}
          />
        ))}
        {!autoScroll && (
          <div onClick={() => setAutoscroll(true)} className={cn("scroll")}>
            <ChevronDown classValue={cn("arrow")} />
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>
    </div>
  );
};
