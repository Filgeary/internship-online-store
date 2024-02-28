export {};

declare global {
  export type TProfile = {
    _id: string;
    _key: string;
    username: string;
    email: string;
    roles: TRole[];
    profile: TInfoProfile;
    status: string;
    isNew: boolean;
    order: number;
    _type: string;
    dateCreate: string;
    dateUpdate: string;
    isDeleted: boolean;
  };

  export type TRole = {
    _id: string;
    _type: string;
  };

  export type TInfoProfile = {
    name: string;
    surname: string;
    phone: string;
    middlename: string;
    birthday: string;
    position: string;
    street: string;
    avatar?: {
      url: string;
    };
  };

  export type TSession = {
    token: string;
    user: TProfile;
  };
}
