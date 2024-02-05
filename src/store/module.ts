import { TConfig } from "@src/config";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule {

  store: any;
  name: string;
  config: TConfig | {};
  services: any;

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
