import type { ApiConfig } from "./api/types";
import { type I18nConfig, LangCodes, LangTitles } from "./i18n/types";
import type { StoreConfig } from "./store/types";
import type { WebSocketConfig } from "./web-socket/types";

const isProduction = process.env.NODE_ENV === 'production';

export type Config = {
  store: StoreConfig,
  api: ApiConfig,
  i18n: I18nConfig,
  webSocket: WebSocketConfig
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
      article: {},
      basket: {},
      categories: {},
      locale: {},
      modals: {},
      profile: {},
      manufacturer: {}
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
  },
  webSocket: {
    url: 'ws://example.front.ylab.io/chat',
    // url: 'ws://localhost:8010/chat',
    // url: 'wss://connect.websocket.in/v3/1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self'
  }
}

export default config;
