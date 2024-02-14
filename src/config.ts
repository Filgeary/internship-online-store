import { Config } from "./types/type";

const isProduction = process.env.NODE_ENV === 'production';

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
        tokenHeader: "X-Token",
      },
      //Настройки для копируемого состояния каталога
      catalogModal: {
        //Не добавлять параметры из/в адресную строку
        ignoreURL: true,
      },
      catalog: {
        ignoreURL: false,
      },
    },
  },
  api: {
    baseUrl: "",
  },
};

export default config;
