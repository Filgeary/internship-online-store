export interface ISessionInitState {
  user: Partial<ISessionUser>;
  token: string | null;
  errors: any;
  waiting: boolean;
  exists: boolean;
}

export interface ISessionSignInData {
  login: string;
  password: string;
}

interface ISessionResponse<T> {
    result: T;
    error: {
        id: string;
        code: string;
        message: string;
        data: {
        issues: {
            path: [];
            rule: string;
            message: string;
        }[];
        };
    };
}

export type ISessionResponseSignIn = ISessionResponse<{
    token: string;
    user: ISessionUser;
}>;

export type ISessionResponseRemind = ISessionResponse<ISessionUser>;

export interface ISessionUser {
  _id: string;
  profile: {
    name: string;
  };
}
