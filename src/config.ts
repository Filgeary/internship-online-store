import { IConfig } from "./types";

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Настройки сервисов
 */
const config : IConfig = {
  store: {
    // Логировать установку состояния?
    log: !isProduction,
    // Настройки модулей состояния
    modules: {
      session: {
        // Названия токена в АПИ
        tokenHeader: 'X-Token'
      },
      catalog: {
        readParams: true,
        saveParams: true
      },
      catalogModal: {
        readParams: false,
        saveParams: false
      }
    }
  },
  api: {
    baseUrl: ''
  },
  redux: {}
}

export default config;
