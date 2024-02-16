import { StoreModuleName } from "./types";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<State, Config = {}> {
  store: any;
  name: StoreModuleName;
  config: Config;
  services: any;
  constructor(store, name: StoreModuleName, config = {} as Config) {
    this.store = store;
    this.name = name;
    this.config = config;
    /** @type {Services} */
    this.services = store.services;
  }

  initState() {
    return {} as State;
  }

  getState() {
    return this.store.getState()[this.name];
  }

  setState(newState, description = "setState") {
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
