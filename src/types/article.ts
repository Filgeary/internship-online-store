export interface TArticle {
  _id: string;
  _key: string;
  name: string;
  title: string;
  description: string;
  price: number;
  madeIn: TMadeIn;
  edition: number;
  category: TCategory;
  order: number;
  isNew: boolean;
  proto: TProto;
  _type: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
  isFavorite: boolean;
}

export type TMadeIn = {
  _id: string;
  _type: string;
  title: string;
  code?: string;
};

export type TCategory = {
  _id: string;
  _type: string;
  title: string;
};

export type TProto = {};
