import type { Article } from "../article/type";

export interface InitialStateCatalog {
  list: Article[] | [];
  params: Params;
  count: number;
  selected: string[];
  waiting: boolean;
}

export interface Params {
  page: number;
  limit: number;
  sort: string | React.Key | readonly React.Key[];
  query: string;
  category: string;
  madeIn: string;
}

export type InitConfigCatalog = {
  ignoreURL: boolean;
};
