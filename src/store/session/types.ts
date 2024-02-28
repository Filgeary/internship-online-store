import { IUser } from "../profile/types"

export interface ISessionInitState {
      user: IUser | Object
      token: string | null
      errors: string | null
      waiting: boolean
      exists: boolean
  }

export interface ISignIn {
    data: {login: string, password: string}
    onSuccess: () => void
}

interface IResponseSessionError {
    error?: {
      code: string
      data: {
        issues: [{
          accept: boolean
          message: string
          rule: string
        }]
      }
      id: string
      message: string
    },
  }
  
  interface IResponseSessionSuccess {
    result?: {
      token: string
      user: IUser
    }
  }
  
  interface IResponseSessionRemindSuccess {
    result?: IUser
  }
  
  export type IResponseSessionRemind = IResponseSessionRemindSuccess &
    IResponseSessionError
  
  export type IResponseDataSession = IResponseSessionSuccess & IResponseSessionError
  
  export type InitConfigSession = {
    tokenHeader: "X-Token";
  };
  