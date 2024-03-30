import { TArticle } from "../catalog/types";

export type TBasketArticle = TArticle & { amount: number };

export type TBasketState = {
  list: TBasketArticle[];
  sum: number;
  amount: number;
  active: string | number;
  waiting?: boolean;
};
