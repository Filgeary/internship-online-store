import ChatList from "@src/components/chat-list"
import ChatMessage from "@src/components/chat-message"
import useSelector from "@src/hooks/use-selector"
import useStore from "@src/hooks/use-store"
import { memo, useEffect, useLayoutEffect, useRef } from "react"

function ChatMessages() {
  const store = useStore()
  const select = useSelector(state => ({
    messages: state.chat.messages,
    viewerId: state.session.user._id
  }))
  
  const ulRef = useRef<HTMLUListElement>(null)
  const lastLiRef = useRef<HTMLLIElement>(null)
  const previousScrollPosition = useRef(0);

  const handleScroll = () => {
    if (!ulRef.current) return
    if (ulRef.current.scrollTop === 0) store.actions.chat.getOldMessages()
    previousScrollPosition.current = ulRef.current.scrollHeight - ulRef.current.scrollTop
  };

  useEffect(() => {
    if (!ulRef.current || !select.messages.length) return
    if (ulRef.current.scrollTop === 0) store.actions.chat.getOldMessages()
  }, [select.messages])

  useLayoutEffect(() => {
    if (!ulRef.current) return
    ulRef.current.scrollTop = ulRef.current.scrollHeight - previousScrollPosition.current;
  }, [select.messages]);

  useLayoutEffect(() => {
    if (!ulRef?.current) return
    if (!lastLiRef?.current) return
    console.log(ulRef.current.scrollTop + ulRef.current.offsetHeight)
    console.log(ulRef.current.scrollHeight)
    if (ulRef.current.scrollTop + ulRef.current.offsetHeight > ulRef.current.scrollHeight - 100) {
      lastLiRef.current.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      })
    }
  }, [select.messages])

  return (
  <ChatList ulRef={ulRef} onScroll={handleScroll}>
    {
      select.messages.map((m, i) => (
        <ChatMessage
          liRef={i === (select.messages.length - 1) ? lastLiRef : undefined}
          authorName={m.author.username}
          text={m.text}
          key={m._key}
          isViewerOwn={m.author._id === select.viewerId}
        />
      ))
    }
  </ChatList>
  )
}

export default memo(ChatMessages)