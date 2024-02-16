import { StoreModuleName } from "./store/types";

const isProduction = process.env.NODE_ENV === "production";

export type ApiConfig = {
  baseUrl: string;
};

type StoreModuleConfig = Record<StoreModuleName, Record<string, string>>;

export type StoreConfig = {
  log: boolean;
  modules: Partial<StoreModuleConfig>;
};

export type Config = {
  store: StoreConfig;
  redux?: {};
  api: ApiConfig;
};

/**
 * Настройки сервисов
 */
const config: Config = {
  store: {
    // Логировать установку состояния?
    log: !isProduction,
    // Настройки модулей состояния
    modules: {
      session: {
        // Названия токена в АПИ
        tokenHeader: "X-Token",
      },
    },
  },
  api: {
    baseUrl: "",
  },
};

export default config;
