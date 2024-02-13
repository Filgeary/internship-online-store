import type { TKeyOfModules } from "./store";

const isProduction = process.env.NODE_ENV === "production";

export type TConfig = typeof config

type MappedKeyOfModules = {
  [key in TKeyOfModules]: {
    [key: string]: any;
  }
}

/**
 * Настройки сервисов
 */
const config = {
  store: {
    // Логировать установку состояния?
    log: !isProduction,
    // Настройки модулей состояния
    modules: {
      session: {
        // Названия токена в АПИ
        tokenHeader: "X-Token",
      },
      catalog: {
        shouldWriteToBrowserHistory: false,
      },
      article: {},
      basket: {},
      modals: {},
      profile: {},
      categories: {},
      locale: {},
    } satisfies MappedKeyOfModules,
  },
  api: {
    baseUrl: "",
  },
  redux: {},
};

export default config;
