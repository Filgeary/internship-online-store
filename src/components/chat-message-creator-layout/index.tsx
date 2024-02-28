import {cn as bem} from '@bem-react/classname'
import './style.css'
import { ChangeEvent, FormEvent } from 'react'

type Props = {
  inputPlaceholder: string
  sendLabel: string
  value: string
  onChange:  (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

function ChatMessageCreatorLayout(props: Props) {
  const cn = bem('ChatMessageCreatorLayout')

  return (
    <form onSubmit={props.onSubmit} className={cn()}>
      <input className={cn('input')} 
            placeholder={props.inputPlaceholder} 
            value={props.value}
            onChange={props.onChange}/>
    </form>
  )
}

export default ChatMessageCreatorLayout