import { ReactNode, RefObject, UIEvent, UIEventHandler, memo } from "react"
import './style.css'

type Props = {
  children: ReactNode | ReactNode[]
  ulRef: RefObject<HTMLUListElement>
  onScroll: UIEventHandler<HTMLUListElement>
}

function ChatList(props: Props) {
  return <ul ref={props.ulRef} className={"ChatList"} onScroll={props.onScroll}>{props.children}</ul>
}

export default memo(ChatList)