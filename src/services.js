import APIService from "./api";
import ModalService from "./modal";
import Store from "./store";
import createStoreRedux from "./store-redux";

class Services {

  constructor(config) {
    this.config = config;
  }

  /**
   * Сервис АПИ
   * @returns {APIService}
   */
  get api() {
    if (!this._api) {
      this._api = new APIService(this, this.config.api);
    }
    return this._api;
  }

  /**
   * Сервис Store
   * @returns {Store}
   */
  get store() {
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
   * Сервис Modal
   */
    get modal(){
      if (!this._modal) {
        this._modal = new ModalService(this, this.config.modal);
      }
      return this._modal;
    }

    dublicateServicesWithLocalStore(localModules) {
      const localServices = {
        ...this
      };
      Object.setPrototypeOf(localServices, this);

      const {store, unsubscribe} = this.store.createLocalStore(localModules)
      localServices._store = store
      return {localServices, unsubscribe}
    }
}

export default Services;
