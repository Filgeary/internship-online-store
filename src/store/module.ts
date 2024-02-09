import type { Config } from "@src/config";
import Store from ".";
import Services from "@src/services";
import type { StoreState } from "./type";
/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
export type StoreNames = keyof StoreState | keyof Config["store"]["modules"];

class StoreModule<T extends StoreNames> {
  store: Store;
  name: string;
  config: Config["store"]["modules"][T];
  services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(
    store: Store,
    name: string,
    config: Config["store"]["modules"][T] = {} as Config["store"]["modules"][T]
  ) {
    this.store = store;
    this.name = name;
    this.config = config as Config["store"]["modules"][T];
    /** @type {Services} */
    this.services = store.services;
  }

  initState(): StoreState[T] {
    return {} as StoreState[T];
  }

  getState(): StoreState[T] {
    return this.store.getState()[this.name as T];
  }

  setState(newState: StoreState[T], description = "setState") {
    this.store.setState(
      {
        ...this.store.getState(),
        [this.name]: newState,
      },
      description
    );
  }
}

export default StoreModule;
