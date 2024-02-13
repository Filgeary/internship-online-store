import APIService from "./api";
import Store from "./store";
import createStoreRedux from "./store-redux";

import type { TConfig } from "./config";

export type TServices = Services;

class Services {
  config: TConfig;
  _api: APIService | null;
  _store: Store | null;
  _redux: any;

  constructor(config: TConfig) {
    this.config = config;
    this._api = null;
    this._store = null;
    this._redux = null;
  }

  get api() {
    if (!this._api) {
      this._api = new APIService(this, this.config.api);
    }
    return this._api;
  }

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
