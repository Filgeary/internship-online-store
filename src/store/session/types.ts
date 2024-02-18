export interface RemindResponse {
  email: String,
  profile: {
    name: string,
    phome: string,
  }
}

export interface IUser extends RemindResponse{}

export interface SessionState {
  user: Partial<IUser>,
  token?: string | null,
  errors?: {
    other?: string,
    login?: string,
    password?: string,
  },
  waiting: boolean,
  exists: boolean,
}

export type SessionConfig = {
  tokenHeader: string
}
