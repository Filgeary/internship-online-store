export type BasketStateType = {
  list: BasketItemType[],
  sum: number,
  amount: number,
}

export type BasketItemType = {
  _id: string | number,
  title: string,
  price: number,
  amount: number,
}
