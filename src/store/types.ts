import type { article, basket, catalog, categories, locale, modals, profile, session } from "./exports";
import type { ArticleConfig, ArticleState } from "./article/types";
import type { BasketConfig, BasketState } from "./basket/types";
import type { CatalogConfig, CatalogState } from "./catalog/types";
import type { CategoriesConfig, CategoriesState } from "./categories/types";
import type { LocaleConfig, LocaleState } from "./locale/types";
import type { ModalsConfig, ModalsState } from "./modals/types";
import type { ProfileConfig, ProfileState } from "./profile/types";
import type { SessionConfig, SessionState } from "./session/types";
import type * as modules from "./exports"; 

type Modules = typeof modules

type BasicState = {
  article: ArticleState,
  basket: BasketState,
  catalog: CatalogState,
  categories: CategoriesState,
  locale: LocaleState,
  modals: ModalsState,
  profile: ProfileState,
  session: SessionState,
  //При создании нового модуля передается тип его состояния
}

type Configs = {
  article: ArticleConfig,
  basket: BasketConfig,
  catalog: CatalogConfig,
  categories: CategoriesConfig,
  locale: LocaleConfig,
  modals: ModalsConfig,
  profile: ProfileConfig,
  session: SessionConfig,
  //При создании нового модуля передается тип его конфига
}

// Тип имени базовых модулей стора
export type BasicModuleName = keyof Modules
// Тип имени скопированных модулей стора
export type CopiedModuleName<T extends BasicModuleName> = `${T}_${number}`
// Тип имени всех модулей стора
export type ModuleName = BasicModuleName | CopiedModuleName<BasicModuleName>


// Тип базовых модулей стора
export type Module = InstanceType<Modules[keyof Modules]>

// Тип-хелпер для получения тип имени базового стора на основе типа имени скопированного
export type ExtractBaseName<T extends string> = 
  T extends `${infer F}_${number}` 
    ? F 
    : T extends BasicModuleName
      ? T
      : never

// Тип всех экшенов модулей стора
export type Actions = {
  [K in ModuleName]: InstanceType<Modules[ExtractBaseName<K>]>
}

// Тип всех стейтов модулей стора
export type State = {
  [K in ModuleName]: BasicState[ExtractBaseName<K>]
}

// Тип конфига модулей стора
type ModulesConfig = IsObjectWithEmptyObjects<{
  [K in BasicModuleName]: Configs[K]
}>

//Тип конфига стора
export type StoreConfig = {
  modules: ModulesConfig,
  log: boolean
}

/* Поверка на пустой объект
 * Пустой объект -> undefined
 * Объект с полями -> тип объекта
*/ 
type IsEmpty<Obj extends object> = keyof Obj extends undefined ? undefined : Obj


//TODO обдумать название типа
type IsObjectWithEmptyObjects<Obj extends object> = {
  [K in keyof Obj]: Obj[K] extends object ? IsEmpty<Obj[K]> : undefined
}

