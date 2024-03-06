import { APIConfig } from "./api/types";
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

export interface ReduxConfig {}

export interface IConfig {
  store: StoreConfig;
  api: APIConfig;
  redux: ReduxConfig;
}

export type StoreConfigModulesKeys = keyof ConfigStoreModules;

