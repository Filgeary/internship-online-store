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
      //Настройки для копируемого состояния каталога
      copyCatalog: {
        //Не добавлять параметры из/в адресную строку
        ignoreURL: true
      }
    }
  },
  api: {
    baseUrl: ''
  }
}

export default config;
