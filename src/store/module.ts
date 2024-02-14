import type { TServices } from "@src/services";
import type { TKeyOfModules, TStore } from ".";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<State, Config = object> {
  store: TStore;
  name: TKeyOfModules;
  config: Config;
  services: TServices

  constructor(store: TStore, name: TKeyOfModules, config: Config | {} = {}) {
    this.store = store;
    this.name = name;
    this.config = config as Config;
    this.services = store.services;
  }

  initConfig(): Config {
    return {} as Config
  }

  initState(): State {
    return {} as State
  }

  getState() {
    return this.store.getState()[this.name] as State;
  }

  setState(newState: State, description = 'setState') {
    this.store.setState({
      ...this.store.getState(),
      [this.name]: newState
    }, description)
  }

}

export default StoreModule;
