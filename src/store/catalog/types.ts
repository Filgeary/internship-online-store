export type TCatalogArticle = TArticle & { count?: number };

export type TCatalogState = {
  list: TCatalogArticle[];
  params: {
    page: number;
    limit: number;
    sort: string;
    query: string;
    category: string;
  };
  count: number;
  waiting: boolean;
};
