import APIService from "./api";
import { Config, TState } from "./types/type";
import Store from "./store";
import SSRService from "./ssr";

class Services {
  config: Config;
  private _api?: APIService;
  private _store?: Store;
  private _ssr?: SSRService;
  state?: TState;

  constructor(config: Config, state?: TState) {
    this.config = config;
    this.state = state
  }

  /**
   * Сервис АПИ
   * @returns {APIService}
   */
  get api(): APIService {
    if (!this._api) {
      this._api = new APIService(this, this.config.api);
    }
    return this._api;
  }

  /**
   * Сервис Store
   * @returns {Store}
   */
  get store(): Store {
    if (!this._store) {
      this._store = new Store(this, this.config.store, this.state);
    }
    return this._store;
  }

  get ssr(): SSRService {
    if(!this._ssr) {
      this._ssr = new SSRService(this, this.config.ssr)
    }
    return this._ssr;
  }
}

export default Services;
