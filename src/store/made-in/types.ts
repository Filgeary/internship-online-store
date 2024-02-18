export interface IMadeInResponse {
  _id: string,
  title: string
  code: string
}

export interface IMadeIn extends IMadeInResponse {}

export interface MadeInState {
  list: IMadeIn[],
  waiting: boolean
}

export type MadeInConfig = {}