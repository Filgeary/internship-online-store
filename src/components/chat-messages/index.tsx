import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";
import ChatMessage, { IChatMessageProps } from "../chat-message";

interface IChatMessagesProps {
  messages: IChatMessageProps[];
  onTopScroll: () => void;
}

function ChatMessages(props: IChatMessagesProps) {
  const cn = bem("ChatMessages");
  const [isScrollDown, setIsScrollDown] = useState<boolean>(true);
  const divRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isScrollDown) {
      divRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.messages, isScrollDown]);

  useLayoutEffect(() => {
    if (prevScrollHeight && chatRef.current && loading === true) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight - prevScrollHeight;
    }
    setLoading(false);
  }, [props.messages])

  const callbacks = {
    scrollHandler: useCallback((e: React.UIEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (chatRef) {
        if (e.currentTarget?.scrollTop === 0) {
          setPrevScrollHeight(scrollHeight);
          setLoading(true);
          props.onTopScroll();
        }
      }
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 200;
      setIsScrollDown(isAtBottom);
    }, [chatRef, setIsScrollDown, setPrevScrollHeight]),
  }

  return (
    <>
    <div className={cn()} onScroll={callbacks.scrollHandler} ref={chatRef}>
      <div style={loading ? {opacity: 1}: {opacity: 0}}>Загрузка...</div>
      {/* {loading && <div>Загрузка...</div>} */}
      <div className={cn("messages")}>
        {props.messages.map((message) => (
          <ChatMessage {...message} key={message._id}/>
        ))}
        <div ref={divRef}></div>
      </div>
    </div>
    </>
  );
}

export default memo(ChatMessages);
