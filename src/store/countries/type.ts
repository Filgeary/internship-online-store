export interface InitialStateCountries {
  list: Country[];
  waiting: boolean;
}

export interface Country {
  _id: string;
  code: string;
  title: string;
}
