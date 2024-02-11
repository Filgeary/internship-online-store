interface Role {
  _id: string,
  _type: string
}

interface ProfileDetailed {
  name: string,
  phone: string,
}

/*
interface ProfileDetailed {
  name: string,
  surname: string,
  phone: string,
  middlename: string,
  avatar: object,
  birthday: string,
  position: string,
  country: object,
  city: object,
  street: string
}
* */

export interface ProfileInterface {
  _id: string,
  _key: string,
  username: string,
  profile: ProfileDetailed,
  roles?: Role[],
  email: string,
  status?: string,
  _type?: string,
}

/*
interface Profile {
  _id: string,
  _key: string,
  username: string,
  profile: ProfileDetailed,
  roles: Role[],
  email: string,
  status: string,
  isNew: boolean,
  order: number,
  _type: string,
  dateCreate: string,
  dateUpdate: string,
  isDeleted: boolean,
}
* */
