import Services from "@src/services";
import { ConfigSSR, TPromiseState } from "./type";

class SSRService {
  services: Services;
  config: ConfigSSR;
  private state: TPromiseState = new Map();
  searchPath: string = '';

  constructor(services: Services, config = {} as ConfigSSR) {
    this.services = services;
    this.config = config;
  }

  /**
   * Создание ожидания
   * @param key
   * @param promise Промис, завершение которого будет ожидаться
   */
  add(key: string, promise: Promise<unknown>) {
    this.state.set(key, promise);
  }

  //** Выполнение всех промисов */
  async execute() {
    await Promise.all(this.state.values());
  }

  /**
   * Наличие ожидание по ключу
   * @param key
   */
  has(key: string) {
    return this.state.has(key);
  }

  /**
   * Удаление ожидания
   * @param key
   */
  delete(key: string) {
    this.state.delete(key);
  }

  /**
   * Установка пути
   * @param path
   */
  setPath(path: string) {
    this.searchPath = path;
  }
}

export default SSRService;
