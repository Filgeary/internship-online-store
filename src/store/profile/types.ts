interface Iprofile {
    avatar: any
    birthday: string
    city: any
    country: any
    middlename: string
    name: string
    phone: string
    position: string
    street: string
    surname: string
}

export interface IUser {
    dateCreate: string
    dateUpdate: string
    email: string
    isDeleted: boolean
    isNew: boolean
    order: number
    profile: Iprofile
    proto: any
    roles: {_id: string, _type: string}
    status: string
    username: string
   _id: string
   _key: string
   _type: string
}

export interface IProfileInitState {
    data: IUser | Object
    waiting: boolean
  }

export interface IApiResponseUser {
    data: {
        result:  IUser
    }
}