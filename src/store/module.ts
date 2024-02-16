import Store from ".";
import Services from "@src/services";

/*
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */

class StoreModule<State, Config = {}> {
  name: string;
  config: Config;
  store: Store;
  services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store: Store, name: string, config: Config | {}) {
    this.store = store;
    this.name = name;
    this.config = config as Config;
    /** @type {Services} */
    this.services = store.services;
  }

  initState(): State {
    return {} as State;
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
