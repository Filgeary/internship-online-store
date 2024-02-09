import { UserProfileType } from "../profile/types";

export type SessionStateType ={
  waiting: boolean;
  exists: boolean;
  token: string | null;
  errors: SessionErrorType | null;
  user: UserProfileType | {};
}

export type SessionErrorType = {
  login?: string;
  password?: string;
  other?: string;
}
