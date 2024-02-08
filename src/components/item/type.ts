import { ItemType } from "../item-basket/type";

export interface ItemProps {
  item: ItemType;
  link: string;
  onAdd: (_id: string) => void;
  labelCurr: string;
  labelAdd: string;
}
