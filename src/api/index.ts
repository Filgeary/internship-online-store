import Services from "@src/services";
import { TConfig } from "@src/config";

type TRequest = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  timeout?: number;
} & Partial<any>;

type TResponse = {
  data: {
    result: any;
    error: { data: { issues: Array<{ message: string }> } };
  };
  status: number;
  headers: {};
};

class APIService {
  services: Services;
  config: TConfig["api"];
  defaultHeaders: Record<string, string>;
  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services: Services, config: TConfig["api"]) {
    this.services = services;
    this.config = config as TConfig["api"];
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * HTTP запрос
   * @param url
   * @param method
   * @param headers
   * @param options
   * @returns {Promise<{}>}
   */
  async request({
    url,
    method = "GET",
    headers = {},
    ...options
  }: TRequest): Promise<TResponse> {
    if (!url.match(/^(http|\/\/)/)) url = this.config.baseUrl + url;
    const res = await fetch(url, {
      method,
      headers: { ...this.defaultHeaders, ...headers },
      ...options,
    });
    return { data: await res.json(), status: res.status, headers: res.headers };
  }

  /**
   * Установка или сброс заголовка
   * @param name {String} Название заголовка
   * @param value {String|null} Значение заголовка
   */
  setHeader(name: string, value: string | null = null) {
    if (value) {
      this.defaultHeaders[name] = value;
    } else if (this.defaultHeaders[name]) {
      delete this.defaultHeaders[name];
    }
  }
}

export default APIService;
