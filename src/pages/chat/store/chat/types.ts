export type TChatState = {
  message: Message[],
  waiting: boolean,
  lastValueOfKeys: string[]
}

export type TChatConfig = { connectionName: string }
