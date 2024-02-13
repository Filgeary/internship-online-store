import { BasicStoreModuleKeys } from "./store/types";

export type ConfigStoreModules = {
  session: {
    tokenHeader: string;
  };
  catalog: {
    readParams: boolean,
    saveParams: boolean
  };
  catalogModal: {
    readParams: boolean;
    saveParams: boolean;
  };
} & Record<BasicStoreModuleKeys, {}>;

export interface StoreConfig {
  log: boolean;
  modules: Partial<ConfigStoreModules>;
}

export interface ApiConfig {
  baseUrl: string;
}

export interface ReduxConfig {}

export interface Config {
  store: StoreConfig;
  api: ApiConfig;
  redux: ReduxConfig;
}

export type StoreConfigModulesKeys = keyof ConfigStoreModules;
