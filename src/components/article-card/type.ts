export interface Article {
  _id: string;
  description: string;
  madeIn: {
    title: string;
    code: string;
  };
  category: {
    title: string;
  };
  edition: string | number;
  price: number;
}

export interface ArticleProps {
  article: Article;
  onAdd: (_id: string) => Promise<void>;
  labelAdd: string;
}
