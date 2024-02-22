import { TCatalogArticle } from '@src/store/catalog/types';
import { TBasketActive } from '@src/store/basket/types';
import { TCategory } from '@src/store/categories/types';
import { TCountry } from '@src/store/countries/types';

export type TCatalogContext = {
  select: {
    list: TCatalogArticle[];
    page: number;
    limit: number;
    count: number;
    waiting: boolean;
    activeItemBasket: TBasketActive;
    sort: string;
    query: string;
    category: string;
    country: string | string[];
    categories: TCategory[];
    countries: TCountry[];
    countriesLoading: boolean;
  };
  // callbacks: Record<string, (...args: any[]) => any>;
  callbacks: {
    addToBasket: (_id: string | number) => void;
    onPaginate: (page: number) => void;
    makePaginatorLink: (page: string | number) => string;
    openModalOfCount: (item: TArticle) => void;
    onSort: (sort: string) => void;
    onSearch: (query: string) => void;
    onReset: () => void;
    onCategory: (category: string) => void;
    onCountrySelected: (country: string) => void;
    onManyCountriesSelected: (country: string[]) => void;
  };
};
