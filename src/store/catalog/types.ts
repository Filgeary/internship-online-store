export interface ICatalogParams {
  page: number;
  limit: number;
  sort: string;
  query: string;
  category: string;
}

export interface ICatalogState {
  list: [];
  params: ICatalogParams;
  count: number;
  waiting: boolean;
}

export interface ICatalogConfig {
  readParams: boolean;
  saveParams: boolean;
}
