import { RefObject, memo } from "react";
import {cn as bem} from '@bem-react/classname'
import './style.css'
import Checkmark from "./checkmark";
import Spinner from "./spinner";

type Props = {
  text: string,
  authorName: string,
  isViewerOwn?: boolean
  liRef: RefObject<HTMLLIElement> | undefined
  receivedFromServer?: true
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
      <div className={cn('flex')}>
        <p className={cn('text')}>{props.text}</p>
        {props.isViewerOwn && (props.receivedFromServer ? <Checkmark fill="#7757D6"/> : <Spinner stroke="#7757D6"/>)}
      </div>
    </li>
  )
}

export default memo(ChatMessage)