import {cn as bem} from '@bem-react/classname'
import './style.css'
import { ChangeEvent, useCallback, KeyboardEvent, useEffect, useRef } from 'react'

type Props = {
  inputPlaceholder: string
  sendLabel: string
  value: string
  onChange:  (e: ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: () => void
}

function ChatMessageCreatorLayout(props: Props) {
  const cn = bem('ChatMessageCreatorLayout')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const callbacks = {
    onKeyDown: useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        props.onSubmit()
      }
    }, [])
  }

  useEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = "20px";
    textareaRef.current.style.height = (textareaRef.current.scrollHeight) + "px";
  }, [props.value])

  return (
    <form onSubmit={props.onSubmit} className={cn()}>
      <textarea className={cn('textarea')}
                ref={textareaRef}
                value={props.value}
                onChange={props.onChange}
                placeholder={props.inputPlaceholder} 
                onKeyDown={callbacks.onKeyDown}/>      
    </form>
  )
}

export default ChatMessageCreatorLayout