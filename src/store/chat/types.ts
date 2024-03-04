export interface IChat {
  _id: string
  _key: string
  text: string
  author: {
    _id: string;
    username: string
    profile: {
      name: string;
      avatar: {
        url: "..."
      }
    }
  }
  dateCreate: string
}

export interface IChatState {
  messages: IChat[]
  message: string
  connected: boolean
  statusClearChat: boolean
}

export interface IResponseLatestMessages {
  method: string
  payload: {
    items: IChat[]
  }
}

export interface IResponseNewMessages {
  method: string
  payload: IChat
}

export type TMessages = IResponseLatestMessages | IResponseNewMessages

