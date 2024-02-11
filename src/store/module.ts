import { TConfig } from '@src/config';
import { TGlobalState } from './types';

import Services from '@src/services';
import Store from '.';

type TStoreName = keyof TGlobalState | keyof TConfig['store']['modules'] | null;

/**
 * Базовый класс для модулей хранилища
 * Для группировки действий над внешним состоянием
 */
class StoreModule<T extends TStoreName = null> {
  readonly name: T;
  readonly config: TConfig['store']['modules'][T] | {};
  store: Store;
  services: Services;

  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store: Store, name: T | string, config = {}) {
    this.store = store;
    this.name = name as T;
    this.config = config;
    /** @type {Services} */
    this.services = store.services;
  }

  initState(): TGlobalState[T] {
    return {} as TGlobalState[T];
  }

  getState(): TGlobalState[T] {
    return this.store.getState()[this.name];
  }

  setState(newState: TGlobalState[T], description = 'setState') {
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
