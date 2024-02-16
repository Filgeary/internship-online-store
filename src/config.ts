const isProduction = process.env.NODE_ENV === 'production';

export type TConfig = Record<string, Record<string, unknown>>;

/**
 * Настройки сервисов
 */
const config: TConfig = {
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
