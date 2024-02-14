export interface Article {
  category: {
    title: string;
    _id: string;
  };
  dateCreate: string;
  dateUpdate: string;
  description: string;
  edition: number;
  isDeleted: boolean;
  isFavorite: boolean;
  isNew: boolean;
  madeIn: {
    title: string;
    code: string;
    _id: string;
  };
  name: string;
  order: number;
  price: number;
  title: string;
  _id: string;
  _key: string;
  _type: string;
}

export interface InitialStateArticle {
  data: Article,
  waiting: boolean
}

export interface ResponseData {
  result: Article
}
