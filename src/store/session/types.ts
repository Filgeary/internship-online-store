import { User } from "../profile/types";

export interface ISessionState {
  user: User;
  token: string | null;
  errors: string | null;
  waiting: boolean;
  exists: boolean;
}

export interface ISessionConfig {
  tokenHeader: string;
}
