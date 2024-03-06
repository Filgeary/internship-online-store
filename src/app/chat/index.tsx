
import ChatInput from "@src/components/chat-input";
import ChatLayout from "@src/components/chat-layout";
import { IChatMessageProps } from "@src/components/chat-message";
import ChatMessages from "@src/components/chat-messages";
import Head from "@src/components/head";
import PageLayout from "@src/components/page-layout";

import LocaleSelect from "@src/containers/locale-select";
import Navigation from "@src/containers/navigation";
import TopHead from "@src/containers/top-head";
import useChat from "@src/hooks/use-chat";
import useInit from "@src/hooks/use-init";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

function Chat() {
  const { t } = useTranslate();
  const store = useStore();

  const select = useSelector((state) => ({
    token: state.session.token,
    userId: state.session.user._id,
    messages: state.chat.list,
    connection: state.chat.connection,
  }));

  useEffect(() => {
    if (!select.token || !select.userId) {
      return;
    }
    store.actions.chat.connect(select.token, select.userId);
    return callbacks.onClose;
  }, [select.token, select.userId]);

  const options = {
    messages: useMemo(
      () =>
        select.messages.map<IChatMessageProps>((msg) => ({
          _id: msg._id,
          date: new Date(msg.dateCreate),
          self: msg.author?._id === select.userId,
          status: msg.status,
          text: msg.text,
          title: msg.author?.username,
        })),
      [select.messages]
    ),
  };

  const callbacks = {
    onLoadOldMessages: useCallback(() => {
      store.actions.chat.onRequestOldMessages();
    }, [store]),
    onSendMessage: useCallback((text: string) => {
      store.actions.chat.onSendMessage(text)
    }, [store]),
    onClose: useCallback(() => {
      store.actions.chat.close();
    }, [store])
  }

  return (
    <PageLayout>
      <TopHead />
      <Head title={t("menu.chat")}>
        <LocaleSelect />
      </Head>
      <Navigation />
      <ChatLayout>
        <ChatMessages messages={options.messages} onTopScroll={callbacks.onLoadOldMessages}/>
        <ChatInput disabled={!select.connection} onSubmit={(text) => callbacks.onSendMessage(text)} />
      </ChatLayout>
      <div style={{height: "100px"}}></div>
    </PageLayout>
  );
}

export default memo(Chat);
