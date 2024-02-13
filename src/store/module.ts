import { IConfig } from "../config.js"
import Store from "./index.js" 
import Services from "../services.js"
import type { StoreState } from "./types.js"


/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
export type StoreNames = keyof StoreState | keyof IConfig["store"]["modules"];

class StoreModule<T extends StoreNames> {
  store: Store
  name: string
  config: IConfig | {}
  services: Services

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(
    store: Store,
    name: string,
    config: {} 
  ) {
    this.store = store
    this.name = name
    this.config = config 
    /** @type {Services} */
    this.services = store.services
  }

  initState(): StoreState[StoreNames] {
    return {} as StoreState[StoreNames];
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
