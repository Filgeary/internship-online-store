import { TCategoryList } from "../categories";

export type TItem = {
  id: string | number;
  selected: boolean;
};

export type TParams = {
  page: number;
  limit: number;
  sort: string | null;
  query: string | null;
  category: string | null | undefined;
  madeIn: string | null;
};

export type TCatalogState = {
  list: TArticle[];
  params: TParams;
  count: number;
  selectedItems: TItem[];
  waiting: boolean;
};


export type TMadeIn = {
  title: string;
  code: string;
  _id: string;
};

export type TArticle = {
  _id: string;
  _key: string;
  name: string;
  title: string;
  description: string;
  price: number;
  madeIn: TMadeIn;
  edition: number;
  category: TCategoryList;
  order: number;
};

export type TArticleState = {
  data: TArticle;
  waiting: boolean;
};