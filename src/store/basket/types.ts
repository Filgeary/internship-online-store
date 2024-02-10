export type TBasketArticle = TArticle & { amount?: number };
export type TBasketActive = TBasketArticle & { countToAdd?: number };

export type TBasketState = {
  list: TBasketArticle[];
  sum: number;
  amount: number;
  active: TBasketActive;
  waiting: boolean;
};
