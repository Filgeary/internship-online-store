import { ItemType } from "../item-basket/type";

export interface SelectableItemProps {
  item: ItemType;
  onSelect: (_id: string) => void;
  labelCurr: string;
  selected: boolean;
}
