import { type RequiredFields } from './utils';

export interface IItem {
  _id: string | number;
  title: string;
  price: number;
  amount: number;
  [prop: string]: any;
}

export type RequiredItemFields<Fields> = RequiredFields<IItem, Fields>;
