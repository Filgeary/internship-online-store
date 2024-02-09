export type CatalogParams = {
  page: number;
  limit: number;
  sort: string;
  query: string;
  category: string;
};

export interface ICatalogState {
  list: [];
  params: CatalogParams;
  count: number;
  waiting: boolean;
}
