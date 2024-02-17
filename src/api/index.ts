import type { TServices } from '@src/services';
import type { TConfig } from '@src/store';
import type { TErrorResponse, TResponse, TSuccessResponse } from '@src/types';

// TODO: show type guards
export function isSuccessResponse<T>(res: TResponse<T>): res is TSuccessResponse<T> {
  return Boolean((res as TSuccessResponse<T>).result);
}

export function isErrorResponse<T>(res: TResponse<T>): res is TErrorResponse {
  return Boolean((res as TErrorResponse).error);
}

class APIService {
  services: TServices;
  config: TConfig['api'];
  defaultHeaders: Record<string, string>;

  constructor(services: TServices, config: TConfig['api'] | object = {}) {
    this.services = services;
    this.config = config as TConfig['api'];
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * HTTP запрос
   */
  async request<T>({
    url,
    method = 'GET',
    headers = {},
    body,
    ...options
  }: {
    url: string;
    method?: RequestInit['method'];
    headers?: HeadersInit;
    body?: BodyInit;
  }) {
    if (!url.match(/^(http|\/\/)/)) url = this.config.baseUrl + url;

    const res = await fetch(url, {
      method,
      headers: { ...this.defaultHeaders, ...headers },
      body,
      ...options,
    });

    return {
      data: (await res.json()) as TResponse<T>,
      status: res.status,
      headers: res.headers,
    };
  }

  /**
   * Установка или сброс заголовка
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
