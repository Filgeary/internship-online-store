import { RefObject, memo } from "react";
import {cn as bem} from '@bem-react/classname'
import './style.css'

type Props = {
  text: string,
  authorName: string,
  isViewerOwn?: boolean
  liRef: RefObject<HTMLLIElement> | undefined
}

function ChatMessage(props: Props) {
  const cn = bem('ChatMessage')

  return (
    <li className={cn({
      alignHorizontal: props.isViewerOwn ? 'end' : 'start'
    })}
      ref={props.liRef}
    >
      <span className={cn('author')}>{props.authorName}</span>
      <p className={cn('text')}>{props.text}</p>
    </li>
  )
}

export default memo(ChatMessage)