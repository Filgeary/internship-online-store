import { TArticle } from "../article/types";

export type TBasketState = {
    list:  TArticle[];
    sum: number;
    amount?: number;
    active: string | number;
  };