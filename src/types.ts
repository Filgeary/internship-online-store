import { APIConfig } from "./api/types";
import { ChatConfig } from "./chat/types";
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
  chat: ChatConfig;
  redux: ReduxConfig;
}

export type StoreConfigModulesKeys = keyof ConfigStoreModules;

