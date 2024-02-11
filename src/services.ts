import APIService from './api';
import Store from './store';
import createStoreRedux from './store-redux';

import { TConfig } from './config';

class Services {
  config: TConfig;
  _api: APIService;
  _store: Store;
  _redux: ReturnType<typeof createStoreRedux>;

  constructor(config: TConfig) {
    this.config = config;
  }

  /**
   * Сервис АПИ
   * @returns {APIService}
   */
  get api() {
    if (!this._api) {
      this._api = new APIService(this, this.config.api);
    }
    return this._api;
  }

  /**
   * Сервис Store
   * @returns {Store}
   */
  get store() {
    if (!this._store) {
      this._store = new Store(this, this.config.store);
    }
    return this._store;
  }

  /**
   * Redux store
   */
  get redux() {
    if (!this._redux) {
      this._redux = createStoreRedux(this, this.config.redux);
    }
    return this._redux;
  }
}

export default Services;
