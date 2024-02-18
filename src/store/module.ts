import { TStoreModuleName } from "./types";
import Store from ".";
import Services from "@src/services";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<State, Config = {}> {
  store: Store;
  name: TStoreModuleName;
  config: Config;
  services: Services;

  constructor(store: Store, name: TStoreModuleName, config = {} as Config) {
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
