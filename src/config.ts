import { ConfigType } from "./types/config";

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
        tokenHeader: 'X-Token',
      },
      catalog: {
        changeUrl: true,
      }
    }
  },
  api: {
    baseUrl: ''
  },
  sockets: {
    chat: {
      url: "ws://example.front.ylab.io/chat"
    },
  }
}

export default config;


