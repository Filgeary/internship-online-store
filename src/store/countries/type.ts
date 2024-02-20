export interface InitialStateCountries {
  list: Country[];
  waiting: boolean;
  selected: Country[];
}

export interface Country {
  _id: string;
  code: string;
  title: string;
}
