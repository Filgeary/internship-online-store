import createStoreRedux from './store-redux';

import { TConfig } from './config';

import APIService from './api';
import Store from './store';
import ChatService from './chat';

class Services {
  config: TConfig;
  _api: APIService;
  _store: Store;
  _redux: ReturnType<typeof createStoreRedux>;
  _chat: ChatService;

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

  /**
   * Сервис чата
   */
  get chat() {
    if (!this._chat) {
      this._chat = new ChatService(this, this.config.chat);
    }
    return this._chat;
  }
}

export default Services;
