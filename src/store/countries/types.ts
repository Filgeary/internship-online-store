export interface Country {
  title: string;
  code: string;
  _id: string;
}

export interface ICountriesState {
  list: Country[];
  waiting: boolean;
}
