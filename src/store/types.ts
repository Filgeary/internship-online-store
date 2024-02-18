import type * as modules from "./exports"; 

export type Modules = {
  [K in keyof typeof modules]: InstanceType<typeof modules[K]>
}

// Имя модуля на основе базового
export type CreateStoreModuleName<Name extends keyof Modules> = Name | `${Name}_${number}`
// Имена модулей на основе базовых
export type ModuleNames = CreateStoreModuleName<keyof Modules>


export type ExtractBaseName<T extends ModuleNames> = 
  T extends `${infer F}_${number}` 
    ? F 
    : T extends keyof Modules
      ? T
      : never


export type Actions = {
  [K in ModuleNames]: Modules[ExtractBaseName<K>]
}

// Базовый стейт
type BasicState = {
  [K in keyof Modules]: ReturnType<Modules[K]['getState']>
}

// Полный Стейт
export type State = {
  [K in ModuleNames]: BasicState[ExtractBaseName<K>]
}

// Конфиги модулей
type ModulesConfig = {
  [K in keyof Modules]: Modules[K]['config']
}

// Конфиг стора
export type StoreConfig = {
  modules: ModulesConfig,
  log: boolean
}