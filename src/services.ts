import APIService from './api';
import SSRService from './ssr';
import Store from './store';
import createStoreRedux from './store-redux';

import type { TConfig, TRootState } from './store';

export type TServices = Services;

class Services {
  readonly initialState: TRootState;
  config: TConfig;
  #api: APIService | null;
  #store: Store | null;
  #redux: ReturnType<typeof createStoreRedux> | null;
  #ssr: SSRService | null;

  constructor(config: TConfig, initState = {}) {
    this.initialState = {} as TRootState;
    this.config = config;
    this.#api = null;
    this.#store = null;
    this.#redux = null;
    this.#ssr = null;
    this.initialState = { ...this.initialState, ...structuredClone(initState) };
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
      this.#store = new Store(this, this.config.store, this.initialState);
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
