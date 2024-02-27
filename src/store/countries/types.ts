export interface ICountriesInitState {
  list: ICountry[];
  waiting: boolean;
}

export interface ICountriesResponse {
  result: {
    items: ICountry[];
  };
}

export interface ICountry {
  _id: string;
  title: string;
  code: string;
}
