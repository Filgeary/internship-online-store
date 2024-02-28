import { ReactNode, memo } from "react"
import './style.css'

type Props = {
  children: ReactNode | ReactNode[]
  head: ReactNode | ReactNode[]
}

function ChatLayout(props: Props) {
  return (
    <div className={"ChatLayout"}
    >
      <div className={"ChatLayout-head"}>{props.head}</div>
      {props.children}
    </div>
  )
}

export default memo(ChatLayout)