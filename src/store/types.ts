import * as modules from "./exports.ts";

///////////////////////
type TModules = typeof modules;

export type TKeyModules = keyof TModules;

export type TActions = {
  [key in TKeyModules]: InstanceType<TModules[key]>;
};

export type TStoreState = {
  [key in TKeyModules]: ReturnType<TActions[key]["initState"]>;
};

///////////////////////

export type TKey<T extends TKeyModules> = T | `${T&string}`;

///////////////////////

export type TStoreActions = {
  [Key in TKeyModules as TKey<Key>]: TActions[Key];
};


export type TNewStoreState = {
  [Key in TKeyModules as TKey<Key>]: TStoreState[Key];
};

