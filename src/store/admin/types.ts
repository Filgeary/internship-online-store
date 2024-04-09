import { TCatalogArticle } from '../catalog/types';
import { TCountry } from '../countries/types';

export type TAdminState = {
  articles: {
    list: TCatalogArticle[];
    count: number;
    active: string;
    activeFetching: boolean;
  };
  cities: {
    list: TCountry[];
    count: number;
    active: string;
    activeFetching: boolean;
  };
};
