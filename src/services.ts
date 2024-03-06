import APIService from "./api";
import ChatService from "./chat";
import Store from "./store";
import createStoreRedux from "./store-redux";
import { IConfig } from "./types";

class Services {
  config: IConfig;
  _api: APIService | undefined;
  _store: Store | undefined;
  _redux: any;
  _chat: ChatService | undefined;

  constructor(config: IConfig) {
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
   * Сервис Чата
   * @returns {ChatService}
   */
  get chat(): ChatService {
    if (!this._chat) {
      this._chat = new ChatService(this, this.config.chat);
    }
    return this._chat;
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
}

export default Services;
