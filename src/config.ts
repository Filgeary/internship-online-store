import type { ApiConfig } from "./api/types";
import { type I18nConfig, LangCodes, LangTitles } from "./i18n/types";
import type { StoreConfig } from "./store/types";

const isProduction = process.env.NODE_ENV === 'production';

export type Config = {
  store: StoreConfig,
  api: ApiConfig,
  i18n: I18nConfig,
}

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
        tokenHeader: 'X-Token'
      },
      catalog: {
        urlEditing: true
      },
      article: undefined,
      basket: undefined,
      categories: undefined,
      locale: undefined,
      modals: undefined,
      profile: undefined
    }
  },
  api: {
    baseUrl: '',
    langHeader: 'X-Lang'
  },
  i18n: {
    // Поддерживаемые языки
    avaliableLangs: [
      {value: LangCodes.ru, title: LangTitles.ru},
      {value: LangCodes.en, title: LangTitles.en},
    ],
    defaultLang: LangCodes.ru,
  }
}

export default config;
