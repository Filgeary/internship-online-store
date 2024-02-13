import type { TConfig } from "@src/config";
import type { TServices } from "@src/services";
import type { TKeyOfModules, TState, TStore } from ".";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<T extends TKeyOfModules> {
  store: TStore;
  name: TKeyOfModules;
  config: TConfig['store']['modules'][T];
  services: TServices

  constructor(store: TStore, name: TKeyOfModules, config: TConfig['store']['modules'][T] | {} = {}) {
    this.store = store;
    this.name = name;
    this.config = config as TConfig['store']['modules'][T];
    this.services = store.services;
  }

  initState() {
    return {}
  }

  getState() {
    return this.store.getState()[this.name] as TState[T];
  }

  setState(newState: TState[T], description = 'setState') {
    this.store.setState({
      ...this.store.getState(),
      [this.name]: newState
    }, description)
  }

}

export default StoreModule;
