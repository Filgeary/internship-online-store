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
  sort: string;
  query: string;
  category: string;
}

export interface ResponseCatalog {
  result: {
    count: number;
    items: Article[]
  }
}

export type InitConfigCatalog = {
  ignoreURL: boolean;
};
