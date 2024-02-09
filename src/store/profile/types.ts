export interface User {
  _id: string;
  username: string;
  email: string;
  roles: Role[];
  profile: Profile;
}

export interface Role {
  _id: string;
  _type: string;
}

export interface Profile {
  name: string;
  surname: string;
  phone: string;
  middlename: string;
  birthday: string;
}

export interface IProfileState {
  data: User;
  waiting: boolean;
}
