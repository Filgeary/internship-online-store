export type CountriesStateType = {
  waiting: boolean;
  list: CountryType[];
}

export type CountryType = {
  _id: string;
  title: string;
  code: string;
}

export type CountriesAPIResponseType = {
  status: number;
  data: {
    result: {
      items: CountryType[];
    }
  }
}
