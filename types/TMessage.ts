declare type MessageAuthor = {
  _id: string,
  username: string,
  profile: {
    name: string,
    avatar: any,
  }
}

declare type Message = {
  _id: string,
  _key: string,
  text: string,
  title: string,
  author: MessageAuthor,
  dateCreate: string,
  waiting?: boolean,
  sendingError?: boolean
}
