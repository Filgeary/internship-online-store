import React, { memo, FC, useEffect, useCallback, useRef } from "react"
import ChatLayout from "@src/components/chat-layout"
import PageLayout from "@src/components/page-layout"
import Head from "@src/components/head"
import TopHead from "@src/containers/top-head"
import Navigation from "@src/containers/navigation"
import LocaleSelect from "@src/containers/locale-select"
import useTranslate from "@src/hooks/use-translate"
import useInit from "@src/hooks/use-init"
import useStore from "@src/hooks/use-store" 
import useSelector from "@src/hooks/use-selector"
import { StoreState } from "@src/store/types"
import { IUser } from "@src/store/profile/types"

const Chat: FC = () => {

  const {t} = useTranslate() 

  const store = useStore();
  const lastMessageRef = useRef() as any;

  const select = useSelector((state: StoreState) => ({
    messages: state.chat.messages,
    message: state.chat.message,
    name: state.session.user as any,
    statusClearChat: state.chat.clearChat
  }));

  const callbacks = {
    // Отправка сообщения
    onMessage: useCallback(() => {
      store.actions.chat.newMessage()
      store.actions.chat.deleteMessage()
    }, [store]),
    // Сохранение сообщения
    onChange: useCallback((value: string, name?: string)=> {store.actions.chat.setMessage(value)}, [store]),
    // Запрос старых сообщений
    onLastMessage: useCallback(() => {
      store.actions.chat.requestOldMessage()
    }, [store]),
    // Запрос новых сообщений
    onNewMessage: useCallback(() => {
      store.actions.chat.requestLatestMessages()
    }, [store]),
    // Очистить чат
    clearChat: useCallback(() => {
      store.actions.chat.deleteAllMessages()
    }, [store]),
  }
 
  useEffect(() => {
    store.actions.chat.request()
     return () => store.actions.chat.close()
  }, [])

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [select.messages]);

  return (
    <PageLayout>
      <TopHead />
      <Head title={t("menu.chat")}>
        <LocaleSelect />
      </Head>
      <Navigation />
      <ChatLayout 
        onMessage={callbacks.onMessage} 
        onLastMessage={callbacks.onLastMessage}
        onNewMessage={callbacks.onNewMessage}
        clearChat={callbacks.clearChat}
        onChange={callbacks.onChange} 
        value={select.message}
        messages={select.messages}
        name={select.name.username}
        ref={lastMessageRef}
        statusClearChat={select.statusClearChat}/>
    </PageLayout>
  );
};

export default memo(Chat)
