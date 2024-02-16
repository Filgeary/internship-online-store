import { IConfig } from "../config.js"
import Store from "./index.js" 
import Services from "../services.js"
import type { StoreState, IKeysModules } from "./types.js"


/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
// export type StoreNames = keyof StoreState | keyof IConfig["store"]["modules"];

class StoreModule<State, Config = object> {
  store: Store
  name: IKeysModules
  config: Config
  services: Services

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(
    store: Store,
    name: IKeysModules,
    config: Config | {} = {} 
  ) {
    this.store = store
    this.name = name
    this.config = config as Config 
    /** @type {Services} */
    this.services = store.services
  }

  initState(): State {
    return {} as State;
  }

  getState() {
    return this.store.getState()[this.name] as State;
  }

  setState(newState: State, description: string = "setState") {
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
