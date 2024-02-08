const isProduction = process.env.NODE_ENV === "production";

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
        tokenHeader: "X-Token",
      },
    },
  },
  api: {
    baseUrl: "",
  },
  redux: {},
};

export type TConfig = typeof config;

export default config;
