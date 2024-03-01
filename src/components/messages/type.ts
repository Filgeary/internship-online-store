import { MessageType } from "@src/store/chat/type"

export type MessagesPropType = {
  messages: MessageType[],
  userId: string,
  loadOldMessages: () => void,
  changeStatus: () => void
}
