import type Services from "@src/services";
import type Store from ".";
import type { ModuleNames } from "./types";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<State extends object, Config extends object> {

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  protected store: Store
  config: Config
  protected services: Services
  protected name: ModuleNames

  constructor(store: Store, name: ModuleNames, config: Config) {
    this.store = store;
    this.name = name;
    this.config = config;
    this.services = store.services;
  }

  protected initState(): State {
    return {} as State
  }

  getState(): State  {
    return this.store.getState()[this.name] as State
  }

  protected setState(newState: State, description: string = 'setState') {
    this.store.setState({
      ...this.store.getState(),
      [this.name]: newState
    }, description)
  }
}

export default StoreModule;

