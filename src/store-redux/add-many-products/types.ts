import { type IItem, type RequiredItemFields } from '@custom-types/item';

type TItem = RequiredItemFields<'_id' | 'title' | 'price'>;

export interface IAddManyProductsSelectedItem {
  _id: IItem['_id'];
  item: TItem;
  pcs: string;
  sum: number;
}

export type TAddManyProductsSelected = IAddManyProductsSelectedItem[];
