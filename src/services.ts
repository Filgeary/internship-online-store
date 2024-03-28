import APIService from "./api"
import WebSocketService from "./socket"
import Store from "./store"
import createStoreRedux from "./store-redux"
import { IConfig } from "./config"

class Services {
  config: IConfig
  private _api?: APIService
  private _socket?: WebSocketService
  private _store?: Store
  private _redux?: any
  readonly initState: object

  constructor(config: IConfig, initState = {}) {
    this.config = config
    this.initState = initState
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
   * @returns {WebSocketService}
   */
   get socket(): WebSocketService {
      if (!this._socket) {
       this._socket = new WebSocketService(this, this.config.api);
      }
      return this._socket;
     }

  /**
   * Сервис Store
   * @returns {Store}
   */
  get store(): Store {
    if (!this._store) {
      this._store = new Store(this, this.config.store, this.initState);
    }
    return this._store;
  }

  /**
   * Redux store
   */
  get redux(){
    if (!this._redux) {
      this._redux = createStoreRedux(this, this.config.redux);
    }
    return this._redux;
  }
}

export default Services;
