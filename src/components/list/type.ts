import { ItemType } from "../item-basket/type";

export interface ListProps {
  list: ItemType[];
  renderItem: (item: ItemType) => JSX.Element;
}
