export interface IProfile {
  readonly email: String,
  readonly profile: {
    readonly name: string,
    readonly phome: string,
  }
}

export interface IProfileState {
  readonly data: Partial<IProfile>,
  readonly waiting: boolean,
}