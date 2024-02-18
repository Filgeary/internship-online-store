import type { ProfileData } from "@src/types"

export type ProfileDataResponse = Pick<ProfileData, 'email' | 'profile'>

export interface ProfileState {
  data: Partial<ProfileData>,
  waiting: boolean,
}

export type ProfileConfig = {}