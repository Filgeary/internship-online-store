import type { TConfig } from './store';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Настройки сервисов
 */
const config: TConfig = {
  store: {
    // Логировать установку состояния?
    log: false,
    // Настройки модулей состояния
    modules: {
      session: {
        // Названия токена в АПИ
        tokenHeader: 'X-Token',
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
      countries: {},
    },
  },
  api: {
    baseUrl: '',
  },
  redux: {},
  ssr: {
    isActive: true,
    isFirstRender: true,
    initPromises: null,
  },
};

export default config;
