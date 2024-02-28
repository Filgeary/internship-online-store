import ChatMessageCreatorLayout from "@src/components/chat-message-creator-layout"
import useStore from "@src/hooks/use-store"
import { ChangeEvent, FormEvent, memo, useCallback, useState } from "react"

function ChatMessageCreator() {
  const store = useStore()
  const [newMessage, setNewMessage] = useState<string>('')

  const callbacks = {
    onChange: useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setNewMessage(e.target.value)
    }, []),

    onSubmit: useCallback((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setNewMessage(prev => {
        if (prev) {
          store.actions.chat.postMessage(prev)
        }
        return ''
      })
    }, [store])
  }


  return (
    <ChatMessageCreatorLayout
      inputPlaceholder="Написать сообщение"
      sendLabel="Отправить"
      onChange={callbacks.onChange}
      onSubmit={callbacks.onSubmit}
      value={newMessage}
    />
  )
}

export default memo(ChatMessageCreator)