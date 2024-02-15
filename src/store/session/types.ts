export interface RemindResponse {
  readonly email: String,
  readonly profile: {
    readonly name: string,
    readonly phome: string,
  }
}

export interface IUser extends RemindResponse{}

export interface SessionState {
  readonly user: Partial<IUser>,
  readonly token?: string | null,
  readonly errors?: {
    other?: string,
    login?: string,
    password?: string,
  },
  readonly waiting: boolean,
  readonly exists: boolean,
}

export type SessionConfig = {
  tokenHeader: string
}
