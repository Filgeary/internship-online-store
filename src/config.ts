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
      chat: {
        baseUrl: "ws://example.front.ylab.io/chat",
      },
    },
  },
  api: {
    baseUrl: "",
  },
  redux: {},
};

export type TConfig = typeof config;

export type TConfigStore = {
  store: {
    log: boolean;
    modules: any;
  };
  api: {
    baseUrl: string;
  };
  redux: {};
  chat: {
    baseUrl: string;
  };
};


export default config;
