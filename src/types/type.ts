import * as modules from "../store/exports.ts";

export type importModules = typeof modules;
export type keyModules = keyof importModules;

export type StoreState = {
  [key in keyModules]: ReturnType<Actions[key]["initState"]>;
};

export type Actions = {
  [key in keyModules]: InstanceType<importModules[key]>;
};

type CopiedStores<T extends keyModules> = T | `${T}${string}`;

export type TActions = {
  [Key in keyModules as CopiedStores<Key>]: Actions[Key];
};

export type KeysCopiedStores = keyof TActions;

export type TState = {
  [Key in keyModules as CopiedStores<Key>]: StoreState[Key];
};

export type ConfigModules = {
  [Key in keyModules as CopiedStores<Key>]: ReturnType<TActions[Key]["initConfig"]>;
};

export type ConfigStore = {
    log: boolean;
    modules: ConfigModules;
};

export type ConfigApi = {
  baseUrl: string;
};

export type Config = {
  store: ConfigStore;
  api: ConfigApi;
}
