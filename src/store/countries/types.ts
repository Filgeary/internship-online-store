import { type TListItem } from '@src/components/list/types';

export interface ICountriesInitState {
  list: TListItem[];
  selected: string[];
  waiting: boolean;
}
