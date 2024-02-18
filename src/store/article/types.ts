import { Category } from "../categories/types";

export interface IArticle {
  _id: string;
  _key: string;
  name: string;
  title: string;
  description: string;
  price: number;
  madeIn: IMadeIn;
  edition: number;
  category: Category;
  order: number;
  isNew: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
}

export interface IMadeIn {
  title: string;
  code: string;
  _id: string;
}

export interface IArticleState {
  data: IArticle;
  waiting: boolean;
}
