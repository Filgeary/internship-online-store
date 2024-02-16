import Store from "@src/store/index";
import {AllModules, AssembledState, ExtendedModulesKey, StoreState} from "@src/store/types";
import Services from "@src/services";
import {CurrentModuleConfig} from "@src/config";

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<T extends ExtendedModulesKey<AllModules>, Config = object> {
  store: Store;
  name: ExtendedModulesKey<AllModules>;
  config: Config;
  services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(
      store: Store,
      name: ExtendedModulesKey<AllModules>,
      config: Config | {} = {}
  ) {
    this.store = store;
    this.name = name;
    this.config = config as Config;
    this.services = store.services;
  }

  initState() {
    return {}
  }
  initConfig() {
    return {} as Config
  }

  getState(): AssembledState[T] {
    return this.store.getState()[this.name] as AssembledState[T];
  }

  setState(newState: AssembledState[T], description: string = 'setState'): void {
    this.store.setState({
      ...this.store.getState(),
      [this.name]: newState
    }, description)
  }

}

export default StoreModule;
