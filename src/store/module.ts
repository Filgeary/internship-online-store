import Store from ".";
import Services from "../services";
import { ExtendedModulesKeys, ModulesKeys, StoreStateType } from "./types";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<T extends ModulesKeys> {
  store: Store;
  name: string;
  config: any;
  services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store: Store, name: string, config = {})  {
    this.store = store;
    this.name = name;
    this.config = config;
    /** @type {Services} */
    this.services = store.services;
  }

  initState() {
    return {}
  }

  getState(): StoreStateType[T] {
    return this.store.getState()[this.name as ExtendedModulesKeys<T>] as StoreStateType[T];
  }

  setState<Key extends ModulesKeys>(newState: StoreStateType[Key], description = 'setState') {
    this.store.setState({
      ...this.store.getState(),
      [this.name as Key]: newState
    }, description)
  }

}

export default StoreModule;
