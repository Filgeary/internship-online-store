export type TMadeIn = {
    _type:string,
    _id: string;
  }
  export type TCategory = {
    _type: string;
    _id: string;
  }

export type TArticle  = {
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
  }
  
  
  
  
  
  export type TArticleState = {
    data: TArticle;
    waiting: boolean;
  }
  