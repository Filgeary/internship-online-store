import APIService from "./api";
import { TConfig } from "./config";
import SsrPromisesService from "./ssr-promises";
import Store from "./store";
import createStoreRedux from "./store-redux";
import WSService from "./ws";

class Services {
  config: TConfig;
  _api: APIService | null = null;
  _ws: WSService | null = null;
  _store: Store | null = null;
  _redux: any;
  _ssrPromises: SsrPromisesService | undefined;

  constructor(config: TConfig) {
    this.config = config;
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
   * Сервис WebSocket
   * @returns {WSService}
   */
  get ws(): WSService {
    if (!this._ws) {
      this._ws = new WSService(this, this.config.chat);
    }
    return this._ws;
  }

  /**
   * Сервис Store
   * @returns {Store}
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

  get ssrPromises() {
    if (!this._ssrPromises) {
      this._ssrPromises = new SsrPromisesService();
    }
    return this._ssrPromises;
  }
}

export default Services;
