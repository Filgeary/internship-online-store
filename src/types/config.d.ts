import { ModulesKeys, ModulesType, StoreStateType } from "../store/types";

export type ConfigType = {
  store: ConfigStoreType;
  api: ConfigApiType;
  sockets: SocketsConfigType,
  redux?: any;
}

export type ConfigApiType = {
  baseUrl: string;
}

export type ConfigModulesType = {
  [key in ModulesKeys]?: ReturnType<InstanceType<ModulesType[key]>['initConfig']>
}

export type ConfigStoreType = {
  log: boolean,
  modules: ConfigModulesType,
}

export type SocketsConfigType = {
  chat: ConfigChatType;
}

export type ConfigChatType = {
  url: string;
}


export type ServicesConfigType = {
  config?: ConfigType;
  storeState?: StoreStateType;
  initials?: string[];
  SSR?: boolean;
}

