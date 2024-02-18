export type TCountries = {
  _id: string;
  _key: string;
  title: string;
  code: string;
  order: number;
  isNew: boolean;
  description: string;
  _type: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type TCountriesState = {
  list: TCountries[];
  waiting: boolean;
};

export type TCountriesConfig = {};
