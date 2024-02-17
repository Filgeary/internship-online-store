export type SessionStateType ={
  waiting: boolean;
  exists: boolean;
  token: string | null;
  errors: SessionErrorType | null;
  user: {
    profile: {
      name: string
    }
  } | null;
}

export type SessionConfigType = {
  tokenHeader: string;
}

export type SessionErrorType = {
  login?: string;
  password?: string;
  other?: string;
}
