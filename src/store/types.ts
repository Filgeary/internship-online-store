import * as modules from "@src/store/exports";

// Получение типов модулей
export type ImportModules = typeof modules;
// Мапинг и получение ключей модулей
export type AllModules = keyof ImportModules;

// Перебор мапы имен модулей по ключам и определение типа модуля через InstanceType передавая модуль
export type ActionsState = {
    [moduleKey in AllModules]: InstanceType<ImportModules[moduleKey]>;
};
// Перебор всего стейта с помощью ReturnType значения, мы как-бы берем и для каждого модуля вызываем initState(), что дает нам доступ к состоянию каждого стор и его типам
export type StoreState = {
    [moduleKey in AllModules]: ReturnType<ActionsState[moduleKey]["initState"]>;
};

export type ExtendedModulesKey<T extends AllModules> = T | `${T}-${string}`;
export type ExtendedModulesAllKey = ExtendedModulesKey<AllModules>

export type AssembledState = {
  [key in AllModules as ExtendedModulesKey<key>]: ReturnType<AssembledActions[key]['initState']>;
};

export type AssembledActions = {
  [key in AllModules as ExtendedModulesKey<key>]: InstanceType<ImportModules[key]>;
};
