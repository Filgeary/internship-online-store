type Message = {
  author: {
    profile: {name: string},
    username: string,
    _id: string
  },
  dateCreate: string
  text: string
  _id: string
  _key: string
}

export interface ChatState {
  messages: Message[]
}

export type ChatConfig = {

}

