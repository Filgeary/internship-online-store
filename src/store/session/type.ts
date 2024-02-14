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

export interface ResponseDataSessionError {
  error?: {
    code: string;
    data: {
      issues: [{
        accept: boolean;
        message: string;
        rule: string;
      }]
    };
    id: string;
    message: string;
  },
}

interface ResponseDataSessionSuccess {
  result?: {
    token: string;
    user: Profile;
  };
}

interface ResponseDataSessionRemindSuccess {
  result?: Profile;
}

export type ResponseDataSessionRemind = ResponseDataSessionRemindSuccess &
  ResponseDataSessionError;

export type ResponseDataSession = ResponseDataSessionSuccess & ResponseDataSessionError;

export type InitConfigSession = {
  tokenHeader: "X-Token";
};
