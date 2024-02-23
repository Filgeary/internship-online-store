import { TConfig } from '@src/config';
import Services from '@src/services';

import { TRequest, TResponse } from './types';

class APIService {
  services: Services;
  config: TConfig['api'];
  defaultHeaders: Record<string, string>;

  constructor(services: Services, config = {}) {
    this.services = services;
    this.config = config as TConfig['api'];
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * HTTP запрос
   * @param url
   * @param method
   * @param headers
   * @param timeout
   * @param options
   * @returns {Promise<{}>}
   */
  async request<T>({
    url,
    method = 'GET',
    headers = {},
    timeout,
    ...options
  }: TRequest): Promise<TResponse<T>> {
    if (!url.match(/^(http|\/\/)/)) url = this.config.baseUrl + url;

    let timerOfErr = null;
    if (Number.isFinite(timeout)) {
      const abortController = new AbortController();
      options.signal = abortController.signal;

      timerOfErr = setTimeout(() => {
        abortController.abort();
      }, timeout);
    }

    let res = null;

    try {
      res = await fetch(url, {
        method,
        headers: { ...this.defaultHeaders, ...headers },
        ...options,
      });

      if (timerOfErr) {
        clearTimeout(timerOfErr);
      }

      return {
        data: await res.json(),
        status: res.status,
        headers: res.headers,
      };
    } catch (err) {
      throw new Error('Ошибка на сервере, попробуйте позже...');
    }
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
