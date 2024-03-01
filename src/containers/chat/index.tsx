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

  const select = useSelector(state => ({
    token: state.session.token,
    userId: state.session.user._id,
    ws: state.chat.ws,
    messages: state.chat.messages
  }))

  useEffect(() => {
    store.actions.chat.connection(select.token!);
    setTimeout(() => {
      store.actions.chat.getLastMessages();
    }, 1000);
    return () => {
      store.actions.chat.close()
    };
  }, [])


  const callbacks = {
    onSubmit: (message: string) => {
      store.actions.chat.sendMessage(message);
    },
    onLoadOldMessages: () => {
      store.actions.chat.getOldMessages();
    },
    onClear: () => {
      store.actions.chat.clearAll()
    },
    onChangeStatus: () => {
      store.actions.chat.changeStatus("read");
    }
  }

  return (
    <SideLayout direction='column'>
      <ButtonClear labelClear={t('chat.clear')} onClear={callbacks.onClear} />
      <Messages messages={select.messages} userId={select.userId!} changeStatus={callbacks.onChangeStatus} loadOldMessages={callbacks.onLoadOldMessages}/>
      <AddMessageForm
        labelSend={t("chat.send")}
        labelPlaceholder={t("chat.placeholder")}
        onSubmit={callbacks.onSubmit}
        connection={select.ws?.readyState === 1}
      />
    </SideLayout>
  );
}
