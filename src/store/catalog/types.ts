export type TCatalogArticle = TArticle & { count?: number };

export type TCatalogState = {
  list: TCatalogArticle[];
  params: {
    page: number;
    limit: number;
    sort: string;
    query: string;
    category: string;
    country: string;
  };
  count: number;
  waiting: boolean;
};

export type TCatalogConfig = {
  ignoreUrlOnInit: boolean;
  ignoreUrl: boolean;
};
