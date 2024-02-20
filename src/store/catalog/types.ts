export type CatalogConfigType = {
  changeUrl: boolean
}

export type CatalogStateType = {
  waiting: boolean;
  count: number;
  list: CatalogArticleType[];
  params: CatalogParamsType
}

export type CatalogParamsType = {
  page: number;
  limit: number;
  sort: string;
  query: string;
  category: string;
  madeIn: string;
}

export type CatalogArticleType = {
  _id: string | number;
  title: string;
  price: number;
}
