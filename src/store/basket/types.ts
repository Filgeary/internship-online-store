import { BasketItem } from "@src/types"

export type ItemResponse = Pick<BasketItem, '_id' | 'price' | 'title'>

export interface BasketState {
  list: BasketItem[],
  sum: number,
  amount: number
}

export type BasketConfig = {}