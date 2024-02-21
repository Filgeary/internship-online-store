import { type RequiredItemFields } from '@custom-types/item';

type TItem = RequiredItemFields<'_id' | 'title' | 'price' | 'amount'>;

export interface IItemSelectCustom {
  item: TItem;
  link: string;
  onLink: (event?: React.MouseEvent) => void;
  onRemove: (item: TItem['_id']) => void;
  labelCurr: string;
  labelDelete: string;
  labelUnit: string;
}
