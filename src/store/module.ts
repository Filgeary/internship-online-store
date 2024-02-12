import type { TConfig } from "@src/config";
import Store from ".";
import Services from "@src/services";
import type { TStoreState } from "./types";

/*
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
export type TStoreName = keyof TStoreState | keyof TConfig["store"]["modules"];

class StoreModule {
  readonly name: string;
  readonly config: TConfig | {};
  store: Store;
  services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store: Store, name: string, config: {}) {
    this.store = store;
    this.name = name;
    this.config = config;
    /** @type {Services} */
    this.services = store.services;
  }

  initState() {
    return {};
  }

  getState() {
    return this.store.getState()[this.name];
  }

  setState(newState: {}, description = "setState") {
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
