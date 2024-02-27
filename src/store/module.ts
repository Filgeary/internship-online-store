import Services from "@src/services";
import Store from ".";
import { StoreModuleKeys } from "./types";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<InitState extends object, Config extends object = object> {
  protected store: Store;
  protected name: StoreModuleKeys;
  protected config: Partial<Config>;
  protected services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store: Store, name: StoreModuleKeys, config: Partial<Config> = {}) {
    this.store = store;
    this.name = name;
    this.config = config;
    this.services = store.services;
  }

  initConfig(): Config {
    return {} as Config;
  }

  initState(): InitState {
    return {} as InitState;
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
