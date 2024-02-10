export interface RemindResponse {
  readonly email: String,
  readonly profile: {
    readonly name: string,
    readonly phome: string,
  }
}

export interface IUser extends RemindResponse{}

export interface ISessionState {
  readonly user: Partial<IUser>,
  readonly token?: string | null,
  readonly errors: any,
  readonly waiting: boolean,
  readonly exists: boolean,
}