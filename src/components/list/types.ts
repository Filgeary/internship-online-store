import { type RequiredItemFields } from '@custom-types/item';

type TItem = RequiredItemFields<'_id'>;

export interface IListProps {
  list: TItem[];
  renderItem: (item: TItem) => React.ReactNode;
}
