import { BasketItem } from "@src/types"

export type ItemResponse = Pick<BasketItem, '_id' | 'price' | 'title'>

export interface BasketState {
  readonly list: BasketItem[],
  readonly sum: number,
  readonly amount: number
}

export type BasketConfig = {}