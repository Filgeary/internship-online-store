import { TGlobalState } from './store/types';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Настройки сервисов
 */
// export type TConfigModules = Partial<Record<keyof TGlobalState, any>>;
const modules = {
  session: {
    // Названия токена в АПИ
    tokenHeader: 'X-Token',
  },
  modals: {
    // Должны ли быть только уникальные модалки
    onlyUnique: false,
  },
  catalog: {
    // Не добавлять в URL при инициализации
    ignoreUrlOnInit: false,
    // Не писать в URL при добавлении
    ignoreUrl: false,
  },
  separateCatalog: {
    ignoreUrlOnInit: false,
    ignoreUrl: true,
  },
};

const config = {
  store: {
    // Логировать установку состояния?
    log: !isProduction,
    // Настройки модулей состояния
    modules,
  },
  api: {
    baseUrl: '',
  },
  redux: {},
};

export type TConfig = typeof config;
export type TConfigModules = typeof modules & Partial<Record<keyof TGlobalState, object>>;

export default config;
