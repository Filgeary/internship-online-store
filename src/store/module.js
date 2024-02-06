import { Config } from "@src/config";
import Store from ".";
// import Services from "@src/services";
// type Name = "basket" | "catalog" | "copyCatalog" | "article" | "categories" | "locale" | "session" | "profile"
/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule {
  // store: Store;
  // name: string;
  // config: {} | Config;
  // services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store, name, config = {}) {
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
    console.log(Store)
    return this.store.getState()[this.name];
  }

  setState(newState, description = 'setState') {
    this.store.setState({
      ...this.store.getState(),
      [this.name]: newState
    }, description)
  }
}

export default StoreModule;
