import { type RequiredItemFields } from '@custom-types/item';

type TItem = RequiredItemFields<'_id' | 'title' | 'price'>;

export interface IItemProps {
  item: TItem;
  clickedItem: string | number;
  link: string;
  onAdd: (item: TItem) => void;
  labelCurr: string;
  labelAdd: string;
}
