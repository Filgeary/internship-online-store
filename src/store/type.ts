import * as modules from "./exports.ts";

export type importModules = typeof modules;
export type keyModules = keyof importModules;

export type StoreState = {
  [key in keyModules]: ReturnType<Actions[key]["initState"]>;
};

export type Actions = {
  [key in keyModules]: InstanceType<importModules[key]>;
};

type AutocompleteName<T extends string> = T | Omit<string, T>;
export type AllStoreNames = AutocompleteName<keyModules>;
