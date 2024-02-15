import type { ProfileData } from "@src/types"

export type ProfileDataResponse = Pick<ProfileData, 'email' | 'profile'>

export interface ProfileState {
  readonly data: Partial<ProfileData>,
  readonly waiting: boolean,
}

export type ProfileConfig = {}