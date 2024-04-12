export type TCatalogArticle = TArticle & { count?: number; amount?: number };

export type TCatalogState = {
  list: TCatalogArticle[];
  params: {
    activeEntity: TCatalogEntities;
    page: number;
    limit: number;
    sort: string;
    query: string;
    category: string;
    countries: string | string[];
  };
  count: number;
  waiting: boolean;
};

export type TCatalogConfig = {
  ignoreUrlOnInit: boolean;
  ignoreUrl: boolean;
};

export type TCatalogEntities = 'articles' | 'cities';
