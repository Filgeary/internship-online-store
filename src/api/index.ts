import Services from "@src/services";
import { ApiConfig } from "./types";

interface Request {
  url: string;
  method?: "GET" | "POST" | "DELETE" | "PUT";
  headers?: Record<string, string>;
}

interface Response<T> {
  data: T;
  status: number;
  headers: any;
}

class APIService {
  defaultHeaders: Record<string, string>;
  services: Services;
  config: ApiConfig;

  constructor(services: Services, config: ApiConfig = {} as ApiConfig) {
    this.services = services;
    this.config = config;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  async request<T>({
    url,
    method = "GET",
    headers = {},
    ...options
  }: Request): Promise<Response<T>> {
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
