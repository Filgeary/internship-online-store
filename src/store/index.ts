import * as modules from './exports.ts';
import type { Config } from '@src/config.ts';
import Services from '@src/services.ts';
import type { Actions, AllStoreNames, StoreState, keyModules } from './type.ts';

/**
 * Хранилище состояния приложения
 */
class Store {
  services: Services;
  config: Config["store"];
  listeners: Function[];
  actions: Actions;
  state: StoreState;

  constructor(
    services: Services,
    config = {} as Config["store"],
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
     * profile: ProfileState
     * }} */
    this.actions = {} as Actions;
    for (const name of Object.keys(modules)) {
      this.actions[name] = new modules[name](
        this,
        name,
        (this.config as Config["store"])?.modules[name] || {}
      );
      this.state[name] = this.actions[name].initState();
    }
    console.log(this.actions);
  }

  /**
   * Создание копии стейта
   */
  make(name: string, base: string) {
    this.actions[name] = new modules[base](
      this,
      name,
      {
        ...this.config?.modules[base],
        ...this.config?.modules[name],
      } || {}
    );
    this.state[name] = this.actions[name].initState();
  }

  /**
   * Удаление копии стейта
   */
  delete(name: string) {
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
