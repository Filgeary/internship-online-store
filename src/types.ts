import { StoreConfigs } from "./store/types";

export type ConfigStoreModules = {
  catalogModal: {
    readParams: boolean;
    saveParams: boolean;
  };
} & StoreConfigs;

export interface StoreConfig {
  log: boolean;
  modules: Partial<ConfigStoreModules>;
}

export interface ApiConfig {
  baseUrl: string;
}

export interface ReduxConfig {}

export interface IConfig {
  store: StoreConfig;
  api: ApiConfig;
  redux: ReduxConfig;
}

export type StoreConfigModulesKeys = keyof ConfigStoreModules;

