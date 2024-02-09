import { IArticleState } from "./article/types";
import { IBasketState } from "./basket/types";
import { ICatalogState } from "./catalog/types";
import { ICategoriesState } from "./categories/types";
import * as modules from "./exports";
import { ILocaleState } from "./locale/types";
import { IModalsState } from "./modals/types";
import { IProfileState } from "./profile/types";
import { ISessionState } from "./session/types";

export interface IState {
  basket: IBasketState;
  catalog: ICatalogState;
  catalog2: ICatalogState;
  modals: IModalsState;
  article: IArticleState;
  locale: ILocaleState;
  categories: ICategoriesState;
  session: ISessionState;
  profile: IProfileState;
}

/**
 * Хранилище состояния приложения
 */
class Store {
  state: IState;
  services: any;
  config: any;
  listeners: any;
  actions: any;
  constructor(services, config = {}, initState = {} as IState) {
    this.services = services;
    this.config = config;
    this.listeners = []; // Слушатели изменений состояния
    this.state = initState;
    this.actions = {};
    for (const name of Object.keys(modules)) {
      this.actions[name] = new modules[name](
        this,
        name,
        this.config?.modules[name] || {}
      );
      this.state[name] = this.actions[name].initState();
    }
  }

  make(name, base) {
    this.actions[name] = new modules[base](
      this,
      name,
      this.config?.modules[base] || {}
    );
    this.state[name] = this.actions[name].initState();
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
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
  getState(): IState {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState, description = "setState") {
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
