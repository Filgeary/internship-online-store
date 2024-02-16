import * as modules from "./exports";

// Тип стора
export type StoreModules = typeof modules;

// Названия модулей
export type StoreModuleName = keyof StoreModules;

//
export type StoreModule = {
  [N in StoreModuleName]: InstanceType<StoreModules[N]>;
};
