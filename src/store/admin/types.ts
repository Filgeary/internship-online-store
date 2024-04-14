import { TCatalogArticle } from '../catalog/types';

export type TAdminState = {
  articles: {
    fetching: boolean;
    active: string | null;
    actionWithActive: TActionsWithActive;
    list: TCatalogArticle[];
    count: number;
    activeFetching: boolean;
  };
  cities: {
    fetching: boolean;
    active: string | null;
    actionWithActive: TActionsWithActive;
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

export type TActionsWithActive = 'edit' | 'look' | '';
