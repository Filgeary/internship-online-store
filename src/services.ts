import APIService from "./api";
import SocketFactoryService from "./socket";
import Store from "./store";
import createStoreRedux from "./store-redux";
import { StoreStateType } from "./store/types";
import { ConfigType, ServicesConfigType } from "./types/config";
import { PromiseService } from "./utils/promise";

class Services {
  config: ConfigType;
  SSR: boolean
  private _api: APIService;
  private _store: Store;
  private _redux: ReturnType<typeof createStoreRedux>;
  private _socketFactory: SocketFactoryService;
  private _promises: PromiseService;
  private storeState: StoreStateType;
  private initials: string[]
  //private _chat: ChatService;

  constructor(config: ServicesConfigType) {
    this.config = config.config;
    this.storeState = config.storeState;
    this.SSR = config.SSR ? true : false;
    this.initials = config.initials;
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
      this._store = new Store(this, this.config.store, this.storeState);
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

  get promises(): PromiseService {
    if(!this._promises) {
      this._promises = new PromiseService(this.initials);
    }

    return this._promises;
  }
}

export default Services;
