export interface ICountriesInitState {
  list: Array<Record<string, unknown>>;
  selected: Array<Record<string, unknown>>;
  waiting: boolean;
}
