import { MessageType } from "@src/store/seance/type"

export type MessagesPropType = {
  messages: MessageType[],
  userId: string
}
