import type Services from "@src/services";
import type Store from ".";
import type { ExtractBaseName, ModuleName, State, StoreConfig } from "./types";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<T extends ModuleName> {

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  protected store: Store
  protected config: StoreConfig['modules'][ExtractBaseName<T>]
  protected services: Services
  protected name: T

  constructor(store: Store, name: T, config: StoreConfig['modules'][ExtractBaseName<T>]) {
    this.store = store;
    this.name = name;
    this.config = config;
    /** @type {Services} */
    this.services = store.services;
  }

  protected initState() {
    return {}
  }

  protected getState(): State[T]  {
    return this.store.getState()[this.name];
  }

  protected setState(newState: State[T], description: string = 'setState') {
    this.store.setState({
      ...this.store.getState(),
      [this.name]: newState
    }, description)
  }
}

export default StoreModule;

