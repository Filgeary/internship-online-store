import { TCatalogArticle } from '../catalog/types';

export type TAdminState = {
  articles: {
    fetching: boolean;
    active: string | null;
    list: TCatalogArticle[];
    count: number;
    activeFetching: boolean;
  };
  cities: {
    fetching: boolean;
    active: string | null;
    list: TCity[];
    count: number;
    activeFetching: boolean;
  };
};

export type TCity = {
  _id: string;
  title: string;
  population: number;
};
