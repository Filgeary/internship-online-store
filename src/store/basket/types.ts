import { Article } from "../article/types";

export interface IBasketState {
  list: Article[];
  sum: number;
  amount: number;
}
