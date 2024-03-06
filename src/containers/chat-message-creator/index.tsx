import ChatMessageCreatorLayout from "@src/components/chat-message-creator-layout"
import useServices from "@src/hooks/use-services"
import useStore from "@src/hooks/use-store"
import { ChangeEvent, FormEvent, memo, useCallback, useMemo, useState } from "react"

function ChatMessageCreator() {
  const store = useStore()
  const [newMessage, setNewMessage] = useState<string>('')
  const services = useServices()
  console.log(newMessage)

  const callbacks = {
    onChange: useCallback((text: string) => {
      setNewMessage(text)
    }, []),

    onSubmit: useCallback(() => {
      setNewMessage(prev => {
        if (prev) {
          store.actions.chat.postMessage(prev.replaceAll('&nbsp;', ''))
        }
        return ''
      })
    }, [store])
  }

  // const [remove, setRemoveClient] = useState<any>()

  // const addClient = () => {
  //   if (remove) return
  //   const removeClient = services.webSocket.addClient({subscriptions: {}})
  //   setRemoveClient(() => removeClient)
  // }

  // const removeClient = () => {
  //   remove()
  //   setRemoveClient(undefined)
  // }

  // const [removeSession, setRemoveClientSession] = useState<any>()

  // const addClientSession = () => {
  //   if (remove) return
  //   const removeClient = services.webSocket.addClient({needSession: true, subscriptions: {}})
  //   setRemoveClientSession(() => removeClient)
  // }

  // const removeClientSession = () => {
  //   removeSession()
  //   setRemoveClientSession(undefined)
  // }

  return (
    <>
      <ChatMessageCreatorLayout
        inputPlaceholder="Написать сообщение"
        sendLabel="Отправить"
        onChange={callbacks.onChange}
        onSubmit={callbacks.onSubmit}
        value={newMessage}
      />
      {/* <button onClick={() => services.webSocket.killConnection()}>Убить соединение</button>
      <button onClick={() => services.webSocket.establishConnection()}>Подключиться к серверу</button>
      <button onClick={() => store.actions.chat.stopListening({resetState: true})}>Отключить прослушивание событий</button>
      <button onClick={() => store.actions.chat.startListening()}>Включить прослушивание событий</button>
      <button onClick={addClient}>Добавить клиента</button>
      <button onClick={removeClient}>Удалить клиента</button>
      <button onClick={addClientSession}>Добавить клиента с сессией</button>
      <button onClick={removeClientSession}>Удалить клиента с сессией</button>
      <button onClick={() => console.log(services.webSocket.events)}>Log modules</button> */}
    </>
  )
}

export default memo(ChatMessageCreator)