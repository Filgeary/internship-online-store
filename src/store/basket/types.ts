import { IArticle } from "../article/types";

export interface IBasketArticle extends IArticle {
  amount: number;
}

export interface IBasketState {
  list: IBasketArticle[];
  sum: number;
  amount: number;
}
