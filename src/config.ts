const isProduction = process.env.NODE_ENV === 'production'

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
        tokenHeader: 'X-Token'
      }
    }
  },
  api: {
    baseUrl: ''
  },
  socket: {
    baseUrl: typeof window !== "undefined" ? "" : "http://example.front.ylab.io"
  },
  redux: {}
}

export type IConfig = typeof config;
export default config;
