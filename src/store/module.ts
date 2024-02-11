import type { TConfig } from "@src/config";
import Store from ".";
import Services from "@src/services";
import type { TStoreState } from "./types";

/*
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
export type TStoreName = keyof TStoreState | keyof TConfig["store"]["modules"];

class StoreModule<T extends TStoreName> {
  store: Store;
  name: T;
  config = {} as any;
  services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store: Store, name: T, config: {}) {
    this.store = store;
    this.name = name as T;
    this.config = config;
    /** @type {Services} */
    this.services = store.services;
  }

  initState(): TStoreState {
    return {} as TStoreState;
  }

  getState() {
    return this.store.getState()[this.name as T];
  }

  setState(
    newState: {
      lang?: string;
      user?: {} | { userName: string };
      token?: string;
      errors?: string[];
      waiting?: boolean;
      exists?: boolean;
      data?: any;
      name?: any;
    },
    description = "setState"
  ) {
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
