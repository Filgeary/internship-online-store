import type { TConfig } from './store';

const isProduction = process.env.NODE_ENV === 'production';
const isSSR = import.meta.env.SSR;

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
      worker: {},
    },
  },
  api: {
    baseUrl: isSSR ? 'http://example.front.ylab.io' : '',
  },
  redux: {},
  ssr: {
    isActive: isSSR,
  },
};

export default config;
