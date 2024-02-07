// export { default as basket } from './basket';
// export { default as catalog } from './catalog';
// export { default as modals } from './modals';
// export { default as article } from './article';
// export { default as locale } from './locale';
// export { default as categories } from './categories';
// export { default as session } from './session';
// export { default as profile } from './profile';

import BasketState from './basket';
import CatalogState from './catalog';
import ModalsState from './modals';
import ArticleState from './article';
import LocaleState from './locale';
import CategoriesState from './categories';
import SessionState from './session';
import ProfileState from './profile';

import StoreModule from './module';

type TExctractor<T extends StoreModule> = ReturnType<T['initState']>;

export interface IGlobalActions {
  basket: BasketState;
  catalog: CatalogState;
  separateCatalog: CatalogState;
  modals: ModalsState;
  article: ArticleState;
  locale: LocaleState;
  categories: CategoriesState;
  session: SessionState;
  profile: ProfileState;
}

export interface IGlobalState {
  basket: TExctractor<BasketState>;
  catalog: TExctractor<CatalogState>;
  separateCatalog: TExctractor<CatalogState>;
  modals: TExctractor<ModalsState>;
  article: TExctractor<ArticleState>;
  locale: TExctractor<LocaleState>;
  categories: TExctractor<CategoriesState>;
  session: TExctractor<SessionState>;
  profile: TExctractor<ProfileState>;
}

const modules = {
  basket: BasketState,
  catalog: CatalogState,
  modals: ModalsState,
  article: ArticleState,
  locale: LocaleState,
  categories: CategoriesState,
  session: SessionState,
  profile: ProfileState,
};

export default modules;
