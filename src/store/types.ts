import * as modules from './exports.js';

// Первый этап, ручная кодировка
// export type DeprecatedStoreModulesKeys = keyof typeof modules;
// export type DeprecatedStoreModuleType = BasketState | CatalogState | ModalsState | ArticleState | LocaleState | CategoriesState | SessionState | ProfileState
// export type DeprecatedStoreModulesStateTypes = BasketStateType | CatalogStateType | ModalsStateType | ArticleStateType | LocaleStateType | CategoriesStateType | SessionStateType | ProfileStateType


// export type DeprecatedStoreActionsType = {
//   basket: BasketState,
//   catalog: CatalogState,
//   modals: ModalsState,
//   article: ArticleState,
//   locale: LocaleState,
//   categories: CategoriesState,
//   session: SessionState,
//   profile: ProfileState,
// }
// export type DeprecatedStoreStateType = {
//   basket: BasketStateType,
//   catalog: CatalogStateType,
//   modals: ModalsStateType,
//   article: ArticleStateType,
//   locale: LocaleStateType,
//   categories: CategoriesStateType,
//   session: SessionStateType,
//   profile: ProfileStateType,
// }


//Второй этап - маппинг

export type ModulesType = typeof modules;

/**
 * Базовый список ключей модулей Store
 */
export type ModulesKeys = keyof ModulesType;

export type BaseActions = {
  [key in ModulesKeys]: InstanceType<ModulesType[key]>
}

export type BaseState = {
  [key in ModulesKeys]: ReturnType<InstanceType<ModulesType[key]>['initState']>
}

// Третий этап - динамическое расширение и маппинг
// 1. собираем расширенные ключи
/**
 * Расширенный тип ключей которые могут быть у модулей StoreModules
 */
export type ExtendedModulesKeys<T extends keyof BaseActions> = T | `${T}${number}`

// 2. Actions
/**
 * Действия доступные модулям
 */
export type StoreActionsType = {
  [key in ModulesKeys as ExtendedModulesKeys<key>]: BaseActions[key]
}

// 3. State
/**
 * State модулей Store
 */
export type StoreStateType = {
  [key in ModulesKeys as ExtendedModulesKeys<key>]: BaseState[key]
}
