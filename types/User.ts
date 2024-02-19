// Интерфейс ролей
interface Role {
  _id: string;
  _type: string;
}

// Профиль
export interface Profile {
  name: string;
  surname?: string;
  phone: string;
  middlename?: string;
  avatar?: any;
  birthday?: string;
  position?: string;
  country?: any;
  city?: any;
  street?: string;
}

// Интерфейс юзера
export interface IUser {
  _id: string;
  _key: string;
  _type?: string;
  dateCreate?: string;
  dateUpdate?: string;
  email: string;
  isDeleted?: boolean;
  isNew?: boolean;
  order?: number;
  profile: Profile;
  proto?: any;
  roles?: Role[];
  status?: string;
  username: string;
}

