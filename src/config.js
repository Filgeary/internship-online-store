const isProduction = process.env.NODE_ENV === 'production';

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
      },
      modals: {
        // Должны ли быть только уникальные модалки
        onlyUnique: false,
      },
      separateCatalog: {
        // Не добавлять в URL при инициализации
        ignoreUrlOnInit: false,
        // Не писать в URL при добавлении
        ignoreUrl: true,
      }
    }
  },
  api: {
    baseUrl: ''
  }
}

export default config;
