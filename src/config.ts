import { Config } from "./types/type";

const isProduction = process.env.NODE_ENV === 'production';

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
      //Настройки для копируемого состояния каталога
      catalog_modal: {
        //Не добавлять параметры из/в адресную строку
        ignoreURL: true,
      },
      catalog: {
        ignoreURL: false,
      },
      chat: {
        url: "ws://example.front.ylab.io/chat",
      },
    },
  },
  api: {
    baseUrl: import.meta.env.SSR ? "http://example.front.ylab.io" : "",
  },
  ssr: {
    isFirstRender: true,
  }
};

export default config;
