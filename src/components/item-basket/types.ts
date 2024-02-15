import type { BasketItem } from "@src/types"
import type { To } from "react-router-dom"

export type ItemBasketProps = {
  item: Pick<BasketItem,'_id' | 'amount' | 'price' | 'title' >,
  link: To,
  labelCurr: string,
  labelUnit: string,
  labelDelete: string,
  onLink: () => void,
  onRemove: (_id: string) => void
}