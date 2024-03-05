import { useEffect } from "react";
import { AddMessageForm } from "@src/components/add-message-form";
import { Messages } from "@src/components/messages";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import { ButtonClear } from "@src/components/button-clear";
import SideLayout from "@src/components/side-layout";

export const Chat = () => {
  const { t } = useTranslate();
  const store = useStore();

  const select = useSelector((state) => ({
    token: state.session.token,
    user: state.session.user,
    messages: state.chat.messages,
    connection: state.chat.connection
  }));

  useEffect(() => {
    store.actions.chat.initConnection(select.token!)
    return () => store.actions.chat.onClose();
  }, []);

  const callbacks = {
    onSubmit: (message: string) => {
      store.actions.chat.sendMessage(message, select.user);
    },
    onLoadOldMessages: () => {
      store.actions.chat.getOldMessages();
    },
    onClear: () => {
      store.actions.chat.clearAllMessages();
    },
    onChangeStatus: () => {
      store.actions.chat.changeStatus("read");
    },
  };

  return (
    <SideLayout direction="column">
      <ButtonClear labelClear={t("chat.clear")} onClear={callbacks.onClear} />
      <Messages
        messages={select.messages}
        userId={select.user._id!}
        changeStatus={callbacks.onChangeStatus}
        loadOldMessages={callbacks.onLoadOldMessages}
      />
      <AddMessageForm
        labelSend={t("chat.send")}
        labelPlaceholder={t("chat.placeholder")}
        onSubmit={callbacks.onSubmit}
        connection={select.connection}
      />
    </SideLayout>
  );
};
