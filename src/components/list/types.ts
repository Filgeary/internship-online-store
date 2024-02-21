import { type RequiredItemFields } from '@custom-types/item';

export type TListItem = RequiredItemFields<'_id'>;

export interface IListProps {
  list: TListItem[];
  renderItem: (item: TListItem) => React.ReactNode;
}
