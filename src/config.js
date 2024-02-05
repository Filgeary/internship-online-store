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
      }
    }
  },
  api: {
    baseUrl: '',
    langHeader: 'X-Lang'
  },
  i18n: {
    // Поддерживаемые языки
    avaliableLangs: [
      {value: 'ru', title: 'Русский'},
      {value: 'en', title: 'English'},
    ],
    defaultLang: 'ru',
  }
}

export default config;
