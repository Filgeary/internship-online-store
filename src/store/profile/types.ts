export type ProfileStateType = {
  waiting: boolean;
  data: UserAccountType | null;
}

export type UserAccountType = {
  email: string;
  profile: UserProfileType
}

export type UserProfileType = {
  name: string;
  phone: string;
}
