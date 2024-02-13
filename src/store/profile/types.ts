export interface IProfileInitState {
  data: Partial<IProfile>;
  waiting: boolean; // признак ожидания загрузки
}

export interface IProfileResponse {
  result: IProfile;
}

export interface IProfile {
  _id: string;
  username: string;
  email: string;
  roles: [
    {
      _id: string;
    }
  ];
  profile: {
    name: string;
    surname: string;
    phone: string;
  };
  status: string;
  isNew: boolean;
  _type: string;
  isDeleted: boolean;
}
