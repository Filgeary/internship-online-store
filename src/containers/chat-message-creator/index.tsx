import ChatMessageCreatorLayout from "@src/components/chat-message-creator-layout"
import useServices from "@src/hooks/use-services"
import useStore from "@src/hooks/use-store"
import { ChangeEvent, FormEvent, memo, useCallback, useMemo, useState } from "react"

function ChatMessageCreator() {
  const store = useStore()
  const [newMessage, setNewMessage] = useState<string>('')
  const services = useServices()

  const callbacks = {
    onChange: useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
      setNewMessage(e.target.value)
    }, []),

    onSubmit: useCallback(() => {
      setNewMessage(prev => {
        if (prev) {
          store.actions.chat.postMessage(prev)
        }
        return ''
      })
    }, [store])
  }

  const [remove, setRemoveClient] = useState<any>()

  const addClient = () => {
    const removeClient = services.webSocket.addClient({needSession: false})
    setRemoveClient(() => removeClient)
  }

  const removeClient = () => {
    remove()
  }

  return (
    <>
      <ChatMessageCreatorLayout
        inputPlaceholder="Написать сообщение"
        sendLabel="Отправить"
        onChange={callbacks.onChange}
        onSubmit={callbacks.onSubmit}
        value={newMessage}
      />
      <button onClick={() => services.webSocket.killConnection()}>Убить соединение</button>
      <button onClick={() => services.webSocket.establishConnection()}>Подключиться к серверу</button>
      <button onClick={() => store.actions.chat.stopListening({resetState: true})}>Отключить прослушивание событий</button>
      <button onClick={() => store.actions.chat.startListening()}>Включить прослушивание событий</button>
      <button onClick={addClient}>Добавить клиента</button>
      <button onClick={removeClient}>Удалить клиента</button>
      <button onClick={() => alert(services.webSocket.connection?.readyState)}>Текущее состояние соединения</button>
    </>
  )
}

export default memo(ChatMessageCreator)