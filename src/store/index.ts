import Services from '../services.js';
import * as modules from './exports.js';
import { StoreActionsType, StoreModulesKeys, StoreStateType } from './types.js';


/**
 * Хранилище состояния приложения
 */
class Store {
  services: Services;
  config: any;
  actions: StoreActionsType;
  state: StoreStateType;
  listeners: Function[]; //((value: StoreStateType) => void)[]

  /**
   * @param services {Services}
   * @param config {Object}
   * @param initState {Object}
   */
  constructor(services: Services, config = {}, initState = {}) {
    this.services = services;
    this.config = config;
    this.listeners = []; // Слушатели изменений состояния
    //this.state = initState;
    /** @type {{
     * basket: BasketState,
     * catalog: CatalogState,
     * modals: ModalsState,
     * article: ArticleState,
     * locale: LocaleState,
     * categories: CategoriesState,
     * session: SessionState,
     * profile: ProfileState
     * }} */
    this.actions = {
      basket: new modules['basket'](this, 'basket', this.config?.modules['basket'] || {} ),
      catalog: new modules['catalog'](this, 'catalog', this.config?.modules['catalog'] || {} ),
      modals: new modules['modals'](this, 'modals', this.config?.modules['modals'] || {} ),
      article: new modules['article'](this, 'article', this.config?.modules['article'] || {} ),
      locale: new modules['locale'](this, 'locale', this.config?.modules['locale'] || {} ),
      categories: new modules['categories'](this, 'categories', this.config?.modules['categories'] || {} ),
      session: new modules['session'](this, 'session', this.config?.modules['session'] || {} ),
      profile: new modules['profile'](this, 'profile', this.config?.modules['profile'] || {} ),
    };

    this.state = {
      basket: this.actions.basket.initState(),
      catalog: this.actions.catalog.initState(),
      modals: this.actions.modals.initState(),
      article: this.actions.article.initState(),
      locale: this.actions.locale.initState(),
      categories: this.actions.categories.initState(),
      session: this.actions.session.initState(),
      profile: this.actions.profile.initState(),
    }

    // for (const name of Object.keys(modules)) {
    //   this.actions[name as StoreModulesKeys] = new modules[name as StoreModulesKeys](this, name as StoreModulesKeys, this.config?.modules[name] || {});
    //   this.state[name as StoreModulesKeys] = this.actions[name as StoreModulesKeys].initState();
    // }
  }

  createModule(name: string, base: StoreModulesKeys) {
    this.actions[name] = new modules[base](this, name, this.config?.modules[base] || {} );
    this.state[name] = this.actions[name].initState();
  }

  deleteModule(name: string) {
    delete this.actions[name];
    delete this.state[name];
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener: Function) {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    }
  }

  /**
   * Выбор состояния
   * @returns {{
   * basket: Object,
   * catalog: Object,
   * modals: Object,
   * article: Object,
   * locale: Object,
   * categories: Object,
   * session: Object,
   * profile: Object,
   * }}
   */
  getState(): StoreStateType {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState: StoreStateType, description = 'setState') {
    if (this.config.log) {
      console.group(
        `%c${'store.setState'} %c${description}`,
        `color: ${'#777'}; font-weight: normal`,
        `color: ${'#333'}; font-weight: bold`,
      );
      console.log(`%c${'prev:'}`, `color: ${'#d77332'}`, this.state);
      console.log(`%c${'next:'}`, `color: ${'#2fa827'}`, newState);
      console.groupEnd();
    }
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener(this.state);
  }
}

export default Store;
