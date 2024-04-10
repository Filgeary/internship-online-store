import { TCatalogArticle } from '../catalog/types';
import { TCountry } from '../countries/types';

export type TAdminState = {
  articles: {
    list: TCatalogArticle[];
    fetching: boolean;
    count: number;
    active: string;
    limit: number;
    page: number;
    activeFetching: boolean;
  };
  cities: {
    list: TCity[];
    fetching: boolean;
    count: number;
    active: string;
    limit: number;
    page: number;
    activeFetching: boolean;
  };
};

export type TCity = {
  _id: string;
  title: string;
  population: number;
};
