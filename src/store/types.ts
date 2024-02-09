import ArticleState from './article/index.js';
import { ArticleStateType } from './article/types.js';
import BasketState from './basket/index.js';
import { BasketStateType } from './basket/types.js';
import CatalogState from './catalog/index.js';
import { CatalogStateType } from './catalog/types.js';
import CategoriesState from './categories/index.js';
import { CategoriesStateType } from './categories/types.js';
import * as modules from './exports.js';
import LocaleState from './locale/index.js';
import { LocaleStateType } from './locale/types.js';
import ModalsState from './modals/index.js';
import { ModalsStateType } from './modals/types.js';
import ProfileState from './profile/index.js';
import { ProfileStateType } from './profile/types.js';
import SessionState from './session/index.js';
import { SessionStateType } from './session/types.js';

export type StoreModulesKeys = keyof typeof modules;
export type StoreModuleType = BasketState | CatalogState | ModalsState | ArticleState | LocaleState | CategoriesState | SessionState | ProfileState
export type StoreModulesStateTypes = BasketStateType | CatalogStateType | ModalsStateType | ArticleStateType | LocaleStateType | CategoriesStateType | SessionStateType | ProfileStateType


export type StoreActionsType = {
  basket: BasketState,
  catalog: CatalogState,
  modals: ModalsState,
  article: ArticleState,
  locale: LocaleState,
  categories: CategoriesState,
  session: SessionState,
  profile: ProfileState,
}
export type StoreStateType = {
  basket: BasketStateType,
  catalog: CatalogStateType,
  modals: ModalsStateType,
  article: ArticleStateType,
  locale: LocaleStateType,
  categories: CategoriesStateType,
  session: SessionStateType,
  profile: ProfileStateType,
}

export type t = {
  [key in StoreModulesKeys]: string
}

export type StoreStateType2 = {
  [key in StoreModulesKeys]?: [InstanceType<typeof modules[key]>]
}



