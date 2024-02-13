export interface IArticleStateResponse {
  result: IArticle;
}

export interface IArticle {
  _id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  madeIn: {
    title: string;
  };
  edition: number;
  category: {
    title: string;
  };
  _type: string;
  dateCreate: string;
  dateUpdate: string;
  isFavorite: false;
}

export interface IArticleInitState {
  data: IArticle | {};
  waiting: boolean;
}
