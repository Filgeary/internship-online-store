export interface ISessionInitState {
  user: Record<string, unknown>;
  token: null | string;
  errors: null | Error;
  waiting: boolean;
  exists: boolean;
}
