import Services from "@src/services";
import { ApiConfig } from "@src/types";

type ApiRequest = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
} & RequestInit

interface ApiResponse<T> {
  data: T,
  status: number,
  headers: any
}

class APIService {
  services: Services;
  config: Partial<ApiConfig>;
  defaultHeaders: Record<string, string>;

  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services: Services, config: Partial<ApiConfig> = {}) {
    this.services = services;
    this.config = config
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  /**
   * HTTP запрос
   * @param url
   * @param method
   * @param headers
   * @param options
   * @returns {Promise<{}>}
   */
  async request<T>({url, method = 'GET', headers = {}, ...options}: ApiRequest): Promise<ApiResponse<T>> {
    if (!url.match(/^(http|\/\/)/)) url = this.config.baseUrl + url;
    const res = await fetch(url, {
      method,
      headers: {...this.defaultHeaders, ...headers},
      ...options,
    });
    return {data: await res.json(), status: res.status, headers: res.headers};
  }

  /**
   * Установка или сброс заголовка
   * @param name {String} Название заголовка
   * @param value {String|null} Значение заголовка
   */
  setHeader(name?: string, value: string | null = null) {
    if (!name) return;
    if (value) {
      this.defaultHeaders[name] = value;
    } else if (this.defaultHeaders[name]) {
      delete this.defaultHeaders[name];
    }
  }
}

export default APIService;
