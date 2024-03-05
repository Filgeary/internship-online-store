import APIService from "./api";
import SocketFactoryService from "./socket";
import Store from "./store";
import createStoreRedux from "./store-redux";
import { ConfigType } from "./types/config";

class Services {
  config: ConfigType;
  private _api: APIService;
  private _store: Store;
  private _redux: ReturnType<typeof createStoreRedux>;
  private _socketFactory: SocketFactoryService;
  //private _chat: ChatService;

  constructor(config: ConfigType) {
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
  get redux(){
    if (!this._redux) {
      this._redux = createStoreRedux(this, this.config.redux);
    }
    return this._redux;
  }
  /**
   * Chat service
   */
  get socketsFactory() {
    if(!this._socketFactory) {
      this._socketFactory = new SocketFactoryService(this, this.config.sockets);
   }
    return this._socketFactory;
  }
}

export default Services;
