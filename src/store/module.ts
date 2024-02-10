import Services from "@src/services";
import Store from ".";
import { IModuleState } from "./types";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<StateType> {

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  protected store: Store
  protected subscriptions: Function[]
  protected name: string
  protected config: any
  protected services: Services

  constructor(store: Store, name: string, config: any) {
    this.store = store;
    this.name = name;
    this.config = config;
    /** @type {Services} */
    this.services = store.services;
    this.subscriptions = []
  }

  protected initState() {
    return {}
  }

  protected getState(): IModuleState<StateType>  {
    return this.store.getState()[this.name];
  }

  protected setState(newState: IModuleState<StateType>, description: string = 'setState') {
    this.store.setState({
      ...this.store.getState(),
      [this.name]: newState
    }, description)
  }
}

export default StoreModule;

