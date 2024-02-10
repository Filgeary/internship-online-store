import { AvaliableLang, LangCodes, LangTitles } from "./i18n/types";

const isProduction = process.env.NODE_ENV === 'production';

export type Config = {
  store: {
    log: Boolean,
    modules: {
      session: {
        tokenHeader: string
      }
    }
  },
  api: {
    baseUrl: String,
    langHeader: String
  },
  i18n: {
    avaliableLangs: AvaliableLang[],
    defaultLang: LangCodes
  }
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
      {value: LangCodes.ru, title: LangTitles.ru},
      {value: LangCodes.en, title: LangTitles.en},
    ],
    defaultLang: LangCodes.ru,
  }
}

export default config;
