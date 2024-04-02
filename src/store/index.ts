import * as modules from './exports.ts';
import Services from '@src/services.ts';
import type { ConfigStore, KeysCopiedStores, TActions, TState, importModules, keyModules } from '../types/type.ts';

/**
 * Хранилище состояния приложения
 */
class Store {
  services: Services;
  config: ConfigStore;
  listeners: ((state: TState) => void)[];
  actions: TActions;
  state: TState;

  constructor(
    services: Services,
    config = {} as ConfigStore,
    initState: TState = {} as TState
  ) {
    this.services = services;
    this.config = config;
    this.listeners = []; // Слушатели изменений состояния
    this.state = initState;

    this.actions = {} as TActions;
    const keys = Object.keys(modules) as keyModules[];
    for (const name of keys) {
      this.create(name);
    }
  }

  create<Key extends keyModules>(name: Key) {
    const module = modules[name] as importModules[Key];
    const newModule = new module(
      this,
      name as KeysCopiedStores,
      this.config?.modules[name] || {}
    ) as TActions[Key];
    this.actions[name] = newModule;
    this.state[name] = this.actions[name].initState() as TState[Key];
  }

  /**
   * Создание копии стейта
   */
  make<T extends KeysCopiedStores, K extends keyModules>(name: T, base: K) {
    const module = modules[base] as importModules[K];
    const newModule = new module(
      this,
      name,
      this.config?.modules[name]
    ) as TActions[T];
    this.actions[name] = newModule;
    this.state[name] = this.actions[name]!.initState() as TState[T];
  }

  /**
   * Удаление копии стейта
   */
  delete<T extends KeysCopiedStores>(name: T) {
    delete this.actions[name];
    delete this.state[name];
  }
  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener: (state: TState) => void): () => void {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }

  /**
   * Выбор состояния
   * @returns {{
   * basket: Object,
   * catalog: Object,
   * modals: Object,
   * article: Object,
   * locale: Object,
   * categories: Object,
   * session: Object,
   * profile: Object,
   * }}
   */
  getState(): TState {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState: TState, description = "setState") {
    if (this.config.log) {
      // console.group(
      //   `%c${"store.setState"} %c${description}`,
      //   `color: ${"#777"}; font-weight: normal`,
      //   `color: ${"#333"}; font-weight: bold`
      // );
      // console.log(`%c${"prev:"}`, `color: ${"#d77332"}`, this.state);
      // console.log(`%c${"next:"}`, `color: ${"#2fa827"}`, newState);
      // console.groupEnd();
    }
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener(this.state);
  }
}

export default Store;
