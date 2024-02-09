import { Category } from "../categories/types";

export interface Article {
  _id: string;
  _key: string;
  name: string;
  title: string;
  description: string;
  price: number;
  madeIn: MadeIn;
  edition: number;
  category: Category;
  order: number;
  isNew: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
}

export interface MadeIn {
  title: string;
  code: string;
  _id: string;
}

export interface IArticleState {
  data: Article;
  waiting: boolean;
}
