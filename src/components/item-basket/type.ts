export interface ItemType {
  _id: string;
  title: string;
  price: number;
  amount?: number;
}

export interface ItemBasketProps {
  item: ItemType;
  link: string;
  onLink: () => void;
  onRemove: (_id: string) => void;
  labelCurr: string;
  labelDelete: string;
  labelUnit: string;
}
