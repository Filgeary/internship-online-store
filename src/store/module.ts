import { TConfig } from '@src/config';
import { TExtendedKeysModules, TGlobalState, TModules } from './types';

import Services from '@src/services';
import Store from '.';

type TStoreName = keyof TGlobalState | keyof TConfig['store']['modules'] | null;

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<State, Config = object> {
  readonly name: TExtendedKeysModules;
  readonly config: Config;
  store: Store;
  services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(
    store: Store,
    name: TExtendedKeysModules,
    config: Config | {} = {}
  ) {
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
