import { memo, useRef, useState } from "react";
import useStore from "@src/hooks/use-store";

import useInit from "@src/hooks/use-init";
import useSelector from "@src/hooks/use-selector";
import ChatFrame from "@src/components/chat-frame";

const Chat = () => {
  const store = useStore();
  const select = useSelector((state) => ({
    connection: state.chat.connection,
    userId: state.session.user._id,
    messages: state.chat.messages,
    waiting: state.chat.waiting,
  }));

  useInit(() => {
    store.actions.chat.request()
     return () => store.actions.chat.close()
  }, [])

  let [message, setMessage] = useState("");

  const callbacks = {
    onSend: (message: string) => {
      store.actions.chat.newMessage(message);
      setMessage("");
    },
    onChange: (e: { target: { value: string } }) => {
      setMessage(e.target.value);
    },
    onLoadOld: () => {
      store.actions.chat.getOldMessages();
    },
  };

  return (
    <>
      <ChatFrame
        onSend={callbacks.onSend}
        onChange={callbacks.onChange}
        onLoadOld={callbacks.onLoadOld}
        messages={select.messages}
        message={message}
        userId={select.userId}
        waiting={select.waiting}
      />
    </>
  );
};

export default memo(Chat);
