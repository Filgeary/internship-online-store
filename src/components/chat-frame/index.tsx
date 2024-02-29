import { cn as bem } from "@bem-react/classname";
import "./style.css";
import { memo, useRef, useState } from "react";
import useInit from "@src/hooks/use-init";
import ChatMessage from "../chat-message";
import Spinner from "../spinner";

type TChatFrameProps = {
  onSend: (message: string) => void;
  onChange: (e: { target: { value: string } }) => void;
  onLoadOld: () => void;
  messages: any[];
  message: string;
  userId: string;
  waiting: boolean;
};
const ChatFrame = (props: TChatFrameProps) => {
  const cn = bem("ChatList");

  const [scroll, setScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useInit(() => {
    if (scroll) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.messages]);

  const callbacks = {
    onScroll: () => {
      if (scrollRef.current?.scrollTop === 0) {
        props.onLoadOld();
        setScroll(false);
      } else if (
        scrollRef.current!.scrollHeight -
          scrollRef.current!.scrollTop -
          scrollRef.current!.clientHeight <
        1
      ) {
        setScroll(true);
      }
    },
    onEnterClick: (e: { stopPropagation?: any; key?: any }) => {
      e.stopPropagation();
      const { key } = e;
      if (key === "Enter") {
        props.onSend(props.message);
      }
    },
  };

  return (
    <div className={cn()}>
      <div className={cn("body")} onScroll={callbacks.onScroll} ref={scrollRef}>
        <Spinner active={props.waiting}>
          {props.messages.map((el, i) =>
            el.author._id === props.userId ? (
              <ChatMessage item={el} key={i} />
            ) : (
              <ChatMessage item={el} key={i} incoming={true} />
            )
          )}
        </Spinner>
        <div ref={ref} />
      </div>
      <div className={cn("footer")}>
        <input
          type="text"
          className={cn("send")}
          onChange={props.onChange}
          onKeyDown={callbacks.onEnterClick}
          value={props.message}
        />
      </div>
    </div>
  );
};

export default memo(ChatFrame);
