import * as modules from "./exports";
import { ICatalogConfig } from "./catalog/types";
import { ISessionConfig } from "./session/types";

/* 
Типы стора
*/

// Модули стора
export type TBasicStoreModules = typeof modules;

// Название базовых модулей
export type TStoreBasicModuleName = keyof TBasicStoreModules;

// Тип базовых модулей (экшены)
export type TBasicStoreModule = {
  [Name in TStoreBasicModuleName]: InstanceType<TBasicStoreModules[Name]>;
};

// Шаблон для названия новых модулей
export type TStoreModuleNameTemplate<Name extends TStoreBasicModuleName> =
  | Name
  | `${Name}${number}`;

// Название новых модулей
export type TStoreNewModuleName = `${TStoreBasicModuleName}${number}`;

// Название модулей
export type TStoreModuleName = TStoreModuleNameTemplate<TStoreBasicModuleName>;

// Все объекты модулей (базовые/копирующие)
export type TStoreModules = {
  [Name in TStoreBasicModuleName as TStoreModuleNameTemplate<Name>]: TBasicStoreModule[Name];
};

// Стейт базовых модулей
export type TBasicState = {
  [Name in TStoreBasicModuleName]: ReturnType<
    TBasicStoreModule[Name]["initState"]
  >;
};

// Весь стейт
export type TState = {
  [Name in TStoreBasicModuleName as TStoreModuleNameTemplate<Name>]: TBasicState[Name];
};

/* 
..
..
Типы конфига стора
..
..
*/

// Тип конфига модуля стора
type TStoreModuleConfig = {
  session: ISessionConfig;
  catalog: ICatalogConfig;
} & Record<TStoreBasicModuleName, object>;

// Тип конфига стора
export interface TStoreConfig {
  log: boolean;
  modules: Partial<TStoreModuleConfig>;
}

// Названия ключей конфига стора
export type TStoreModuleConfigName = keyof TStoreModuleConfig;
