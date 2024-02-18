import APIService from "./api";
import { TConfig } from "./config";
import Store from "./store";
import createStoreRedux from "./store-redux";

class Services {
  config: TConfig;
  _api: any;
  _store: any;
  _redux: any;

  constructor(config: TConfig) {
    this.config = config;
  }

  /**
   * Сервис АПИ
   */
  get api(): APIService {
    if (!this._api) {
      this._api = new APIService(this, this.config.api);
    }
    return this._api;
  }

  /**
   * Сервис Store
   */
  get store(): Store {
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
