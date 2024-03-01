import { MessageType } from "@src/store/chat/type"

export type MessagePropsType = {
  message: MessageType,
  self: boolean,
  changeStatus: () => void
}
