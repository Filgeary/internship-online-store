export interface InitialStateCountries {
  list: Country[],
  waiting: boolean,
  count: number,
}

export interface Country {
  _id: string;
  code: string;
  title: string;
}
