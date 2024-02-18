import type { Profile } from "../profile/type";

export interface InitialStateSession {
  errors: {
    other?: string[]
  } | null,
  exists: boolean,
  token: string | null,
  user: Partial<Profile>,
  waiting: boolean
}

export interface Credentials {
  login: string;
  password: string;
}

export type InitConfigSession = {
  tokenHeader: "X-Token";
};
