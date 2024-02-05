import { TArticle } from "./article";

export type TItem = Pick<TArticle, "_id" | "title" | "price"> & {
  count?: number;
  amount?: number;
};
