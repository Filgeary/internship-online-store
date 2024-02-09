export type ProfileStateType = {
  waiting: boolean;
  data: UserAccountType | {};
}

export type UserAccountType = {
  email: string;
  profile: UserProfileType
}

export type UserProfileType = {
  name: string;
  phone: string;
}
