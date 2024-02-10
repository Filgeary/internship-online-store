import APIService from "./api";
import I18nService from "./i18n";
import Store from "./store";

class Services {

  private _api: APIService
  private _store: Store
  private _i18n: I18nService
  private config: any

  constructor(config: any) {
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
   * Сервис i18n
   * @returns {I18nService}
   */
    get i18n(): I18nService {
      if (!this._i18n) {
        this._i18n = new I18nService(this, this.config.i18n);
      }
      return this._i18n
    }
}

export default Services;
