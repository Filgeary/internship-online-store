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

// Первый этап, ручная кодировка
export type DeprecatedStoreModulesKeys = keyof typeof modules;
export type DeprecatedStoreModuleType = BasketState | CatalogState | ModalsState | ArticleState | LocaleState | CategoriesState | SessionState | ProfileState
export type DeprecatedStoreModulesStateTypes = BasketStateType | CatalogStateType | ModalsStateType | ArticleStateType | LocaleStateType | CategoriesStateType | SessionStateType | ProfileStateType


export type DeprecatedStoreActionsType = {
  basket: BasketState,
  catalog: CatalogState,
  modals: ModalsState,
  article: ArticleState,
  locale: LocaleState,
  categories: CategoriesState,
  session: SessionState,
  profile: ProfileState,
}
export type DeprecatedStoreStateType = {
  basket: BasketStateType,
  catalog: CatalogStateType,
  modals: ModalsStateType,
  article: ArticleStateType,
  locale: LocaleStateType,
  categories: CategoriesStateType,
  session: SessionStateType,
  profile: ProfileStateType,
}


//Второй этап - маппинг

export type ModulesType = typeof modules;
export type ModulesKeys = keyof ModulesType;

export type BaseActions = {
  [key in ModulesKeys]: InstanceType<ModulesType[key]>
}

export type BaseState = {
  [key in ModulesKeys]: ReturnType<InstanceType<ModulesType[key]>['initState']>
}

// Третий этап - динамическое расширение и маппинг
// 1. собираем расширенные ключи
export type ExtendedModulesKeys<T extends keyof BaseActions> = T | `${T}${number}`

// 2. Actions
export type StoreActionsType = {
  [key in ModulesKeys as ExtendedModulesKeys<key>]: BaseActions[key]
}

// 3. State
export type StoreStateType = {
  [key in ModulesKeys as ExtendedModulesKeys<key>]: BaseState[key]
}
