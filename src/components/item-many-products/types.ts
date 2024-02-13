import { type IAddManyProductsSelectedItem } from '@src/store-redux/add-many-products/types';
import { type RequiredItemFields } from '@custom-types/item';

type TItem = RequiredItemFields<'_id' | 'title' | 'price' | 'amount'>;

export interface IItemManyProductsProps {
  item: TItem;
  selectedItems: TItem[];
  onEdit: (item: TItem, pcs?: IAddManyProductsSelectedItem['pcs']) => void;
  onSelectProduct: (item: TItem) => void;
  onChangePcs: (item: TItem['_id'], value: string) => void;
  clickedItem: TItem['_id'];
  labelEdit: string;
  labelCurr: string;
}
