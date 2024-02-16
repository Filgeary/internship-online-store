import { TExtendedKeysModules } from './types';

import Services from '@src/services';
import Store from '.';
import { TConfigModules } from '@src/config';

// type TStoreName = keyof TGlobalState | keyof TConfig['store']['modules'] | null;

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<State, Config = {}> {
  readonly name: TExtendedKeysModules;
  readonly config: Config;
  store: Store;
  services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store: Store, name: TExtendedKeysModules, config: Config | object = {} as Config) {
    this.store = store;
    this.name = name;
    this.config = config as Config;
    /** @type {Services} */
    this.services = store.services;
  }

  initState(): State {
    return {} as State;
  }

  getState() {
    return this.store.getState()[this.name] as State;
  }

  setState(newState: State, description: string = 'setState') {
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
