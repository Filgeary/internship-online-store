export interface IUserSession {
  token: string;
  user: User;
}

interface User {
  _id: string;
  _type: string;
  order: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
  isNew: boolean;
  proto: Proto;
  email: string;
  username: string;
  roles: Role[];
  status: string;
  profile: Profile;
  session: Session;
}

interface Proto {
  _id: string;
  _type: string;
}

interface Role {
  _id: string;
  _type: string;
}

interface Profile {
  name: string;
  surname: string;
  middlename: string;
  avatar: Avatar;
  phone: string;
  birthday: string;
  gender: string;
  position: string;
  country: Country;
  city: City;
  street: string;
}

interface Avatar {
  _id: string;
  _type: string;
}

interface Country {
  _id: string;
  _type: string;
}

interface City {
  _id: string;
  _type: string;
}

interface Session {
  dateSignIn: string;
  dateSignOut: string;
}
