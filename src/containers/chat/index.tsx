import { AddMessageForm } from "@src/components/add-message-form";
import { Messages } from "@src/components/messages";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import { useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const Chat = () => {
  const { t } = useTranslate();
  const store = useStore();

  const select = useSelector(state => ({
    token: state.session.token,
    userId: state.session.user._id,
    connection: state.chat.connection,
    messages: state.chat.messages
  }))

  useEffect(() => {
    store.actions.chat.auth(select.token!);
    setTimeout(() => {
      store.actions.chat.onMessage();
      store.actions.chat.getLastMessages()
    }, 1000);
    return () => store.actions.chat.close();
  }, [])

  const callbacks = {
    onSubmit: (message: string) => {
      store.actions.chat.sendMessage(message);
    },
  }

  return (
    <>
      <Messages messages={select.messages} userId={select.userId!}/>
      <AddMessageForm
        labelSend={t("chat.send")}
        labelPlaceholder={t("chat.placeholder")}
        onSubmit={callbacks.onSubmit}
        connection={select.connection}
      />
    </>
  );
}
