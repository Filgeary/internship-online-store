import { TConfig } from "@src/config";
import type Services from "@src/services";
import { IRequestProps } from "./types";

class APIService {
  services: Services;
  config: TConfig;
  defaultHeaders: HeadersInit;

  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services: Services, config = {}) {
    this.services = services;
    this.config = config;
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
  async request({url, method = 'GET', headers = {}, ...options}: Partial<IRequestProps>) {
    if (!url?.match(/^(http|\/\/)/)) url = this.config.baseUrl + (url ?? '');
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
  setHeader(name: keyof HeadersInit, value = null) {
    if (value) {
      this.defaultHeaders[name] = value;
    } else if (this.defaultHeaders[name]) {
      delete this.defaultHeaders[name];
    }
  }
}

export default APIService;
