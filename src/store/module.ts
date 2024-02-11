import type { TConfig } from "@src/config";
import Store from ".";
import Services from "@src/services";
import type { TStoreState } from "./types";

/*
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
export type TStoreNames =
  | keyof TStoreState
  | keyof TConfig["store"]["modules"]
  | null;

class StoreModule {
  store: Store;
  name: string;
  config = {} as any;
  services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store: Store, name: string, config: {}) {
    this.store = store;
    this.name = name as string;
    this.config = config;
    /** @type {Services} */
    this.services = store.services;
  }

  initState(){
    return {} ;
  }

  getState() {
    return this.store.getState()[this.name];
  }

  setState(newState: { lang?: string; user?: {} | { userName: string; }; token?: string; errors?: string[]; waiting?: boolean; exists?: boolean; data?: any; name?: any; }, description = "setState") {
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
