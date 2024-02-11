export type TBasketArticle = TArticle & { amount: number };
export type TBasketActive =
  | (Omit<TBasketArticle, 'amount'> & { countToAdd?: number })
  | null;

export type TBasketState = {
  list: TBasketArticle[];
  sum: number;
  amount: number;
  active: TBasketActive;
  waiting: boolean;
};
