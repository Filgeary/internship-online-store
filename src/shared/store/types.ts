import * as modules from "@src/shared/store/import";

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

// Специальный тип стора, которые собирается из внутренних конфигов, определяя их через ReturnType, проходясь по каждому модулю
export type TModulesConfig = {
  // @ts-ignore
  [moduleKey in AllModules as ExtendedModulesKey<moduleKey>]: ReturnType<ActionsState[moduleKey]["initConfig"]>;
}

// Расширение ключей модулей, чтобы можно было использовать названия, которые просто начинаются с названия модуля
export type ExtendedModulesKey<T extends AllModules> = T | `${T}-${string}`;

// Типы состояний всех модулей + разрешение индексации по расширенным ключам
export type AssembledState = {
  [key in AllModules as ExtendedModulesKey<key>]: ReturnType<AssembledActions[key]['initState']>;
};

// Типы состояний всех модулей + разрешение индексации по расширенным ключам
export type AssembledActions = {
  [key in AllModules as ExtendedModulesKey<key>]: InstanceType<ImportModules[key]>;
};
