import * as modules from './exports'
import { IConfig } from '../config'
import Services from '../services' 
import type { Actions, StoreState, importModules, keyModules } from './types.ts';

/**
 * Хранилище состояния приложения
 */
class Store {
  services: Services;
  config: IConfig["store"];
  listeners: Function[];
  actions: Actions;
  state: StoreState;

  constructor(
    services: Services,
    config = {} as IConfig["store"],
    initState = {} as StoreState
  ) {
    this.services = services;
    this.config = config;
    this.listeners = []; // Слушатели изменений состояния
    this.state = initState;
    /** @type {{
     * basket: BasketState,
     * catalog: CatalogState,
     * modals: ModalsState,
     * article: ArticleState,
     * locale: LocaleState,
     * categories: CategoriesState,
     * session: SessionState,
     * profile: ProfileState,
     * catalog-modal: CatalogModalState
     * }} */
    this.actions = {} as Actions;
    const keys = Object.keys(modules) as keyModules[];
    for (const name of keys) {
      this.create(name);
    }
  }

  create<Key extends keyModules>(name: Key) {
    const b = modules[name] as importModules[Key];
    const a = new b(this, name, {} as any) as Actions[Key];
    this.actions[name] = a;
    this.state[name] = this.actions[name].initState() as StoreState[Key];
  }

  /**
   * Удаление копии стейта
   */
  delete<Key extends keyModules>(name: Key) {
    delete this.actions[name];
    delete this.state[name];
  }
  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener: Function): Function {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
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
  getState(): StoreState {
    return this.state as StoreState;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState: StoreState, description = "setState") {
    if (this.config.log) {
      console.group(
        `%c${"store.setState"} %c${description}`,
        `color: ${"#777"}; font-weight: normal`,
        `color: ${"#333"}; font-weight: bold`
      );
      console.log(`%c${"prev:"}`, `color: ${"#d77332"}`, this.state);
      console.log(`%c${"next:"}`, `color: ${"#2fa827"}`, newState);
      console.groupEnd();
    }
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener(this.state);
  }
}

export default Store;

