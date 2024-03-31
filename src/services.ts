import APIService from './api';
import SSRService from './ssr';
import Store from './store';
import createStoreRedux from './store-redux';

import type { TConfig } from './store';

export type TServices = Services;

class Services {
  config: TConfig;
  #api: APIService | null;
  #store: Store | null;
  #redux: any;
  #ssr: SSRService | null;

  constructor(config: TConfig) {
    this.config = config;
    this.#api = null;
    this.#store = null;
    this.#redux = null;
    this.#ssr = null;
  }

  get ssr() {
    if (!this.#ssr) {
      this.#ssr = new SSRService(this, this.config.ssr);
    }
    return this.#ssr;
  }

  get api() {
    if (!this.#api) {
      this.#api = new APIService(this, this.config.api);
    }
    return this.#api;
  }

  get store() {
    if (!this.#store) {
      this.#store = new Store(this, this.config.store);
    }
    return this.#store;
  }

  /**
   * Redux store
   */
  get redux() {
    if (!this.#redux) {
      this.#redux = createStoreRedux(this, this.config.redux);
    }
    return this.#redux;
  }
}

export default Services;
