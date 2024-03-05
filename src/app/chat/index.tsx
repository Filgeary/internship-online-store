import React, { memo, FC, useEffect, useCallback, useRef, useState } from "react"
import ChatLayout from "@src/components/chat-layout"
import PageLayout from "@src/components/page-layout"
import Head from "@src/components/head"
import TopHead from "@src/containers/top-head"
import Navigation from "@src/containers/navigation"
import LocaleSelect from "@src/containers/locale-select"
import useTranslate from "@src/hooks/use-translate"
import useStore from "@src/hooks/use-store" 
import useSelector from "@src/hooks/use-selector"
import Textarea from "@src/components/chat-layout/textarea"
import MessageFont from "@src/components/chat-layout/message-font" 
import { StoreState } from "@src/store/types"

const Chat: FC = () => {

  const {t} = useTranslate() 

  const store = useStore()
  const lastMessageRef = useRef() as any
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isBold, setIsBold] = useState(false)
  const [fontOpen, setFontOpen] = useState(false)

  const select = useSelector((state: StoreState) => ({
    messages: state.chat.messages,
    message: state.chat.message,
    name: state.session.user as any,
    statusClearChat: state.chat.statusClearChat,
    connected: state.chat.connected
  }));

  const callbacks = {
    // Отправка сообщения
    onMessage: useCallback(() => {
      store.actions.chat.newMessage()
      store.actions.chat.deleteMessage()
      resetTextareaHeight()
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
    // Регулирование высоты textarea
    adjustTextareaHeight: useCallback(() => {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }
    }, [store]),
    // Добавление жирного шрифта
    handleBold: useCallback(() => {
      setIsBold(true)
      setFontOpen(false)
    }, [setIsBold]),
    // Отмена жирного шрифта
    handleNormal: useCallback(() => {
      setIsBold(false)
      setFontOpen(false)
    }, [setIsBold]),
    // Показать или скрыть шрифты
    handleFont: useCallback(() => {
      setFontOpen(!fontOpen)
    }, [setFontOpen]),
  }

  const resetTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
    }
}

  const renders = {
    textarea: useCallback(
      () => (
        <Textarea
          placeholder="Написать сообщение..." 
          addMessage={callbacks.onChange} 
          adjustTextareaHeight={callbacks.adjustTextareaHeight}
          value={select.message}
          ref={textareaRef}
          isBold={isBold}
        />
      ),
      [store, callbacks.onChange, select.message]
    ),
    font: useCallback(
      () => (
        <MessageFont
        onClickBold={callbacks.handleBold}
        onClickNormal={callbacks.handleNormal}
        />
      ),
      [store, callbacks.onChange, select.message]
    ),
  }
 
  useEffect(() => {
    store.actions.chat.onConnect()
     return () => store.actions.chat.close()
  }, [])

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" })
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
        messages={select.messages}
        name={select.name.username}
        ref={lastMessageRef}
        statusClearChat={select.statusClearChat}
        textarea={renders.textarea}
        font={renders.font}
        isfontOpen={fontOpen}
        setFontOpen={setFontOpen}
        connected={select.connected}/>
    </PageLayout>
  )
}

export default memo(Chat)
