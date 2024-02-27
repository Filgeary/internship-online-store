export interface ICatalogInitState {
  list: ICatalogItem[];
  params: ICatalogStateValidParams;
  count: number;
  waiting: boolean;
}

export interface ICatalogResponseApi {
  result: {
    items: ICatalogItem[];
    count: number;
  };
}

export interface ICatalogItem {
    _id: string;
    title: string;
    price: number;
    isDeleted: boolean;
    isFavorite: boolean;
  }

export interface ICatalogStateValidParams {
  page: number;
  limit: number;
  sort?: string;
  query?: string;
  category?: string;
  madeIn: string;
}

export interface ICatalogConfig {
  readParams: boolean,
  saveParams: boolean
}
