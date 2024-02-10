import type Services from "@src/services";
import type { Response } from "./types";
import type { Config } from "@src/config";

class APIService {

  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  private config: Config['api']
  private defaultHeaders: Record<string, string>
  public services: Services

  constructor(services: Services, config: Config['api']) {
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
  public async request<T>({url, method = 'GET', headers = {}, ...options}): Promise<Response<T>> {
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
  public setHeader(name: string, value: any = null): void {
    if (value) {
      this.defaultHeaders[name] = value;
    } else if (this.defaultHeaders[name]) {
      delete this.defaultHeaders[name];
    }
  }

  public async getItemTitle(_id: string): Promise<string | undefined> {
    try {
      const res = await this.request<{title: string}>({url: `/api/v1/articles/${_id}`})
      return res.data.result.title
    } catch (error) {
      return undefined
    }
  }
}

export default APIService;
