export {};

declare global {
  export type TItem = Pick<TArticle, "_id" | "title" | "price"> & {
    count?: number;
    amount?: number;
  };
}
