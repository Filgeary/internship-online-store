import type { article, basket, catalog, categories, locale, modals, profile, session } from "./exports";
import type { IArticleState } from "./article/types";
import type { IBasketState } from "./basket/types";
import type { ICatalogState } from "./catalog/types";
import type { ICategoriesState } from "./categories/types";
import type { ILocaleState } from "./locale/types";
import type { IModalState } from "./modals/types";
import type { IProfileState } from "./profile/types";
import type { ISessionState } from "./session/types";

type IBasicModules = {
  readonly article: article,
  readonly basket: basket,
  readonly catalog: catalog,
  readonly categories: categories,
  readonly locale: locale,
  readonly modals: modals,
  readonly profile: profile,
  readonly session: session,
}

type IBasicActions = {
  readonly [K in keyof IBasicModules]: IBasicModules[K];
}

export type IBasicModuleName = keyof IBasicActions 

export type ICopiedModuleName<T extends IBasicModuleName> = 
  T |`${T}${number}`

type ICopiedModules = {
  [key: ICopiedModuleName<'article'>]: article
  [key: ICopiedModuleName<'basket'>]: basket,
  [key: ICopiedModuleName<'catalog'>]: catalog,
  [key: ICopiedModuleName<'categories'>]: categories,
  [key: ICopiedModuleName<'locale'>]: locale,
  [key: ICopiedModuleName<'modals'>]: modals,
  [key: ICopiedModuleName<'profile'>]: profile,
  [key: ICopiedModuleName<'session'>]: session,
}

type SX = {
  [X in IBasicModuleName as ICopiedModuleName<X>]: IBasicActions[X]
}
  
type j = Omit<SX>

let s: SX;
s.article123.load

type ICopiedActions = {
  [K in keyof ICopiedModules]: ICopiedModules[K];
}

export type IActions = IBasicActions & ICopiedActions


type IBasicStoreState = {
  readonly article: IArticleState,
  readonly basket: IBasketState,
  readonly catalog: ICatalogState,
  readonly categories: ICategoriesState,
  readonly locale: ILocaleState,
  readonly modals: IModalState,
  readonly profile: IProfileState,
  readonly session: ISessionState,
}

type ICopiedStoreState = {
  [key: ICopiedModuleName<'article'>]: IArticleState
  [key: ICopiedModuleName<'basket'>]: IBasketState,
  [key: ICopiedModuleName<'catalog'>]: ICatalogState,
  [key: ICopiedModuleName<'categories'>]: ICategoriesState,
  [key: ICopiedModuleName<'locale'>]: ILocaleState,
  [key: ICopiedModuleName<'modals'>]: IModalState,
  [key: ICopiedModuleName<'profile'>]: IProfileState,
  [key: ICopiedModuleName<'session'>]: ISessionState,
}

export type IStoreState = IBasicStoreState & ICopiedStoreState

export type IModuleState<T> =
  T extends IArticleState
    ? IArticleState 
    : T extends IBasketState
    ? IBasketState 
    : T extends ICatalogState
    ? ICatalogState 
    : T extends ICategoriesState
    ? ICategoriesState
    : T extends ILocaleState
    ? ILocaleState
    : T extends IModalState
    ? IModalState 
    : T extends IProfileState
    ? IProfileState
    : T extends ISessionState
    ? ISessionState 
    : never
