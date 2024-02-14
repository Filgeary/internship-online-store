import Store from ".";
import Services from "@src/services";
import { KeysCopiedStores } from "../types/type";
/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */

class StoreModule<State, Config = object> {
  store: Store;
  name: KeysCopiedStores;
  config: Config;
  services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store: Store, name: KeysCopiedStores, config: Config | {} = {}) {
    this.store = store;
    this.name = name;
    this.config = config as Config;
    /** @type {Services} */
    this.services = store.services;
  }

  initState(): State {
    return {} as State;
  }

  initConfig(): Config {
    return {} as Config;
  }

  getState(): State {
    return this.store.getState()[this.name] as State;
  }

  setState(newState: State, description = "setState") {
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
