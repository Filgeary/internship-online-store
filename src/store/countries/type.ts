export interface InitialStateCountries {
  list: Country[],
  waiting: boolean,
  count: number,
  selected: Country | null
}

export interface Country {
  _id: string;
  code: string;
  title: string;
}
