import * as modules from "./exports.ts";

export type TImportModules = typeof modules;

export type TKeyModules = keyof TImportModules;

export type TStoreState = {
  [key in TKeyModules]: ReturnType<TActions[key]["initState"]>;
};

export type TActions = {
  [key in TKeyModules]: InstanceType<TImportModules[key]>;
};

export type TAutocompleteName<T extends string> = T | Omit<string, T>;

export type TAllStoreNames = TAutocompleteName<TKeyModules>;

export type TKey<T extends TKeyModules> = T | `${T}${string}`;
export type TFullKey = {
  [Key in TKeyModules as TKey<Key>]: TActions[Key];
};

//let s :TFullKey;
//s.basket123.addToBasket
