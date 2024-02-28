import { SetStateAction, memo, useState } from "react";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import useInit from "@src/hooks/use-init";
import useSelector from "@src/hooks/use-selector";
import ChatFrame from "@src/components/chat-frame";

const Chat = () => {
  const store = useStore();
  const select = useSelector((state) => ({
    token: state.session.token,
    userId: state.session.user._id,
    connection: state.chat.connection,
    ws: state.chat.ws,
    messages: state.chat.messages,
    waiting:state.chat.waiting
  }));

  useInit(
    () => {
      store.actions.chat.auth(select.token!);
      setTimeout(() => {
        store.actions.chat.onMessage();
        store.actions.chat.getLastMessages();
      }, 1000);
      // store.actions.chat.onClose();
      return () => {
        store.actions.chat.close();
      };
    },
    [],
    true
  );
  let [message, setMessage] = useState("");

  const callbacks = {
    onSend: (message: string) => {
      store.actions.chat.sendMessage(message);
      setMessage('')
    },
    onChange:(e: { target: { value: string }; })=>{
        setMessage(e.target.value);
    },
    onLoadOld:()=>{
        store.actions.chat.getOldMessages()
    }
  }

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
