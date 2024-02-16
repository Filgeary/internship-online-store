import Services from "@src/services.ts";
import * as modules from "./exports.ts";
import { TConfig, TConfigStore } from "@src/config.ts";
import {
  TActions,
  TKey,
  TKeyModules,
  TNewStoreState,
  TStoreActions,
} from "./types.ts";

/**
 * Хранилище состояния приложения
 */
class Store {
  services: Services;
  config: TConfigStore["store"];
  listeners: Function[];
  state: TNewStoreState & Record<string, any>;
  actions: TActions & Record<string, any>;

  /**
   * @param services {Services}
   * @param config {Object}
   * @param initState {Object}
   */
  constructor(services: Services, config = {}, initState = {}) {
    this.services = services;
    this.config = config as TConfigStore["store"];
    this.listeners = []; // Слушатели изменений состояния
    this.state = initState as TNewStoreState;
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
    this.actions = {} as TActions;
    for (const name of Object.keys(modules) as TKeyModules[]) {
      this.create(name);
    }
  }

  create<Key extends TKeyModules>(name: Key) {
    this.actions[name] = new modules[name](
      this,
      name,
      this.config.modules[name] as TConfigStore['store']
    ) as TStoreActions[Key];
    this.state[name] = this.actions[name].initState() as TNewStoreState[Key];
  }

  make<Key extends TKey<U>, U extends TKeyModules>(
    name: Key,
    base: TKeyModules
  ) {
    const newName = `${base}${name}`;

    this.actions[newName] = new modules[base](
      this,
      newName,
      this.config.modules[name] as TConfigStore['store']
    ) as TStoreActions[Key];

    this.state[newName] = this.actions[
      newName
    ].initState() as TNewStoreState[Key];
  }

  clear(name: string) {
    delete this.actions[name];
    delete this.state[name];
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener: {
    (...args: any): void;
    (...args: any): void;
  }): Function {
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
  getState() {
    return this.state as any;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState: {}, description = "setState") {
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
    this.state = newState as TNewStoreState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener(this.state);
  }
}

export default Store;
