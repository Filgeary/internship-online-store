import Store, { TModulesNames, TState } from ".";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule {
  store;
  name;
  config;
  services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store: Store, name: TModulesNames, config = {}) {
    this.store = store;
    this.name = name;
    this.config = config;
    /** @type {Services} */
    this.services = store.services;
  }

  initState(): Record<string, any> {
    return {}
  }

  getState() {
    return this.store.getState()[this.name];
  }

  setState<Name extends TModulesNames>(newState: TState[Name], description = 'setState') {
    this.store.setState({
      ...this.store.getState(),
      [this.name]: newState
    }, description)
  }

}

export default StoreModule;
