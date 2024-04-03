import Services from "@src/services";
import type { ConfigApi } from "./type";

class APIService {
  services: Services;
  config: ConfigApi;
  defaultHeaders: Record<string, string>;

  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services: Services, config: ConfigApi = {} as ConfigApi) {
    this.services = services;
    this.config = config;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * HTTP запрос
   */
  async request({
    url,
    method = "GET",
    headers = {} as Headers,
    ...options
  }: Partial<Request>) {
    if (!url?.match(/^(http|\/\/)/)) {
      url = this.config.baseUrl + url;
    }

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
