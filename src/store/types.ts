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




type TKey<T extends TKeyModules> = T | `${T}${number}`
export type TFullKey = {
  [X in TKeyModules as TKey<X> ]:TActions[X]
}

//let s :TFullKey;
//s.basket123.addToBasket