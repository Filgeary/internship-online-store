import * as modules from "./exports.ts";

type TModules = typeof modules;
export type TDefaultModules = keyof TModules;

export type IAddCloneModule = TModules & {
  catalogModal: typeof modules.catalog;
};
export type TAddCloneModule = IAddCloneModule;
export type TKeyModules = keyof TAddCloneModule;

export type TStoreState = {
  [key in TKeyModules]: ReturnType<TActions[key]["initState"]>;
};

export type TActions = {
  [key in TKeyModules]: InstanceType<TAddCloneModule[key]>;
};

export type TAutocompleteName<T extends string> = T | Omit<string, T>;

export type TAllStoreNames = TAutocompleteName<TKeyModules>;

export type TKey<T extends TKeyModules> = T | `${T}${string}`;
export type TFullKey = {
  [Key in TKeyModules as TKey<Key>]: TActions[Key];
};

//let s :TFullKey;
//s.basket123.addToBasket
