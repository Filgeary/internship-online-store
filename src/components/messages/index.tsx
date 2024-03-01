import { FC, useEffect, useRef, useState } from "react";
import { cn as bem } from "@bem-react/classname";
import Message from "./message";
import { ChevronDown } from "../icons/arrow/arrow";
import { MessagesPropType } from "./type";
import debounce from "lodash.debounce";
import "./style.css";

export const Messages: FC<MessagesPropType> = ({ messages, userId, loadOldMessages, changeStatus }) => {
  const cn = bem("Messages");
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (autoScroll) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
    const element = mRef.current as HTMLDivElement;
    if (
      Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight
        ) < 200
        ) {
          !autoScroll && setAutoScroll(true);
        } else {
          autoScroll && setAutoScroll(false);
        }

        if(element.scrollTop === 0) {
          setAutoScroll(false);
          element.scrollTop = 1;
          loadOldMessages();
        }
      };

  return (
    <div className={cn()} ref={mRef} onScroll={debounce(scrollHandler, 200)}>
      {messages.map((msg) => (
        <Message
          key={msg._key}
          message={msg}
          self={userId === msg.author._id}
          changeStatus={changeStatus}
        />
      ))}
      {!autoScroll && (
        <div onClick={() => setAutoScroll(true)} className={cn("scroll")}>
          <ChevronDown classValue={cn("arrow")} />
        </div>
      )}
      <div ref={scrollRef}></div>
    </div>
  );
};
