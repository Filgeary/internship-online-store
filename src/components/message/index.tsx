import { MessageType } from "@src/ws/type"
import { FC } from "react"

export const Message: FC<MessageType> = (message) => {
  return <article>
    <h5>{message.author.username}</h5>
    <p>{message.text}</p>
  </article>
}
