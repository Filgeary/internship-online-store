import Store from ".";
import { StoreModulesKeys, StoreModulesStateTypes } from "./types";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule {
  store: Store;
  name: StoreModulesKeys ;
  config: unknown;
  services: unknown;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store: Store, name: StoreModulesKeys, config = {})  {
    this.store = store;
    this.name = name;
    this.config = config;
    /** @type {Services} */
    this.services = store.services;
  }

  initState() {
    return {}
  }

  getState() {
    return this.store.getState()[this.name];
  }

  setState(newState: StoreModulesStateTypes, description = 'setState') {
    this.store.setState({
      ...this.store.getState(),
      [this.name]: newState
    }, description)
  }

}

export default StoreModule;
