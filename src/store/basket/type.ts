import { Article } from "../article/type";

interface ListItem extends Article {
  amount: number
}

export interface InitialStateBasket {
  list: ListItem[] | [],
  amount: number,
  sum: number,
  waiting: boolean
}

