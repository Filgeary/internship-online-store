import { ExtendedModulesKeys, ModulesKeys } from "./store/types";

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Настройки сервисов
 */
const config: ConfigType = {
  store: {
    // Логировать установку состояния?
    log: !isProduction,
    // Настройки модулей состояния
    modules: {
      session: {
        // Названия токена в АПИ
        tokenHeader: 'X-Token'
      }
    }
  },
  api: {
    baseUrl: ''
  }
}

export default config;

export type ConfigType = {
  store: ConfigStoreType;
  api: ConfigApiType;
  redux?: any;
}

export type ConfigStoreType = {
  log: boolean,
  modules: {
    [key in ModulesKeys as ExtendedModulesKeys<key>]?: any
  }
}

export type ConfigApiType = {
  baseUrl: string;
}
