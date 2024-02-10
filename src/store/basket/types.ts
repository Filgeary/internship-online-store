export interface IItemReponse {
  readonly price: number, 
  readonly title: string,
  readonly _id: string,
}

export interface IBasketItem extends IItemReponse {
  readonly amount: number, 
}

export interface IBasketState {
  readonly list: IBasketItem[],
  readonly sum: number,
  readonly amount: number
}