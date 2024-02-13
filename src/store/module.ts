import Services from "@src/services";
import Store from ".";
import { ConfigStoreModules, StoreConfigModulesKeys } from "@src/types";
import { StoreModuleKeys } from "./types";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<Cfg extends StoreConfigModulesKeys, InitState> {
  store: Store;
  name: StoreModuleKeys;
  config: Partial<ConfigStoreModules[Cfg]>;
  services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store: Store, name: StoreModuleKeys, config: Partial<ConfigStoreModules[Cfg]> = {}) {
    this.store = store;
    this.name = name;
    this.config = config;
    this.services = store.services;
  }

  initState() {
    return {}
  }

  getState() {
    return this.store.getState()[this.name] as InitState;
  }

  setState(newState: InitState, description = 'setState') {
    this.store.setState({
      ...this.store.getState(),
      [this.name]: newState
    }, description)
  }

}

export default StoreModule;
