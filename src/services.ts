import APIService from "./api";
import Store from "./store";
import {Config} from "@src/config";
import WebSocketService from "@src/websocket";

class Services {
  private config: Config;
  private _api: APIService | null = null;
  private _websocket: WebSocketService | null = null;
  private _store: Store | null = null;

  constructor(config: Config) {
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

  get websocket(): WebSocketService {
    if (!this._websocket) {
      this._websocket = new WebSocketService(this, this.config.websocket)
    }
    return this._websocket;
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
}

export default Services;
