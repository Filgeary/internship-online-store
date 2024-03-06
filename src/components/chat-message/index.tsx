import { RefObject, memo, useMemo } from "react";
import * as DOMPurify from 'dompurify';
import {cn as bem} from '@bem-react/classname'
import Checkmark from "./checkmark";
import Spinner from "./spinner";
import './style.css'

type Props = {
  text: string,
  authorName: string,
  dateCreate: Date
  isViewerOwn?: boolean
  liRef: RefObject<HTMLLIElement> | undefined
  receivedFromServer?: true
}

function ChatMessage(props: Props) {
  const cn = bem('ChatMessage')
  const render = {
    time: String(props.dateCreate.getHours()).padStart(2, '0') + ':' + String(props.dateCreate.getMinutes()).padStart(2, '0'),
    text: useMemo(() => DOMPurify.sanitize(props.text, {
      ALLOWED_TAGS: ['b', 'i', 'a'],
      ALLOWED_ATTR: ['href'],
    }), [props.text])
  }

  return (
    <li className={cn({
      alignHorizontal: props.isViewerOwn ? 'end' : 'start'
    })}
      ref={props.liRef}
    >
      <span className={cn('author')}>{props.authorName}</span>
        <p className={cn('text')} dangerouslySetInnerHTML={{__html: render.text}}/>
        <div className={cn('status')}>
          <span className={cn('time')}>{render.time}</span>
          {props.isViewerOwn && (props.receivedFromServer ? <Checkmark fill="#7757D6"/> : <Spinner stroke="#7757D6"/>)}
        </div>
    </li>
  )
}

export default memo(ChatMessage)