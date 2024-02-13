import { BasketItemType } from "../../store/basket/types";

export type ItemBasketPropsType = {
  item: BasketItemType;
  link: string;
  labelUnit: string;
  labelDelete: string;
  labelCurr?: string;
  onLink: () => void;
  onRemove: (id: string | number) => void;
}
