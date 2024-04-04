import { TCategoryList } from "../categories";

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
