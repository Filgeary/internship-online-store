import APIService from "./api";
import { Config } from "./types/type";
import Store from "./store";
import ChatApiService from "./chat-api";

class Services {
  config: Config;
  private _api?: APIService;
  private _store?: Store;
  private _chat?: ChatApiService;

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

  get chat(): ChatApiService {
    if (!this._chat) {
      this._chat = new ChatApiService(this, this.config.chat);
    }
    return this._chat;
  }
}

export default Services;
