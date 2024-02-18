export interface Profile {
  dateCreate: string;
  dateUpdate: string;
  email: string;
  isDeleted: boolean;
  isNew: boolean
  order: number;
  profile: {
    birthday: string;
    city: string;
    name: string;
    phone: string;
    position: string;
    street: string;
    surname: string;
  }
  roles: {
    _id: string,
    _type: string
  };
  status: string;
  username: string;
  _id: string;
  _key: string;
  _type: string
}

export interface InitialStateProfile {
  data: Profile | {};
  waiting: boolean;
}
