export type CatalogParams = {
  page: number;
  limit: number;
  sort: string;
  query: string;
  category: string;
  madeIn: string;
};

export interface ICatalogState {
  list: [];
  params: CatalogParams;
  count: number;
  waiting: boolean;
}
