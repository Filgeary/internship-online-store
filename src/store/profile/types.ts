export type TProfileState = {
  data: TUser;
  waiting: boolean;
};

export type TProfile = {
  avatar: any;
  birthday: string;
  city: any;
  country: any;
  name: string;
  phone: string;
  surname: string;
};

export type TUser = {
  email: string;
  profile: TProfile;
  proto: any;
  roles: { _id: string; _type: string };
  status: string;
  username: string;
  _id: string;
  _key: string;
  _type: string;
};

export type TApiResponseUser = {
  data: {
    result: TUser;
  };
};
