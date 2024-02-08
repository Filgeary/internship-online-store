import { Config } from '@src/config.ts';
import * as modules from './exports.ts';
import Services from '@src/services.ts';

type importModules = typeof modules;
export type keyModules = keyof importModules;
type State = ReturnType<InstanceType<importModules[keyModules]>["initState"]>;
// type AutocompleteName<T extends string> = T | Omit<string, T>;
// type AllStoreNames = AutocompleteName<keyModules>;
type InitialState = {
  [key in keyModules]: State;
};
type PickMatching<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};
type ExtractMethods<T> = PickMatching<T, Function>;
type Actions = ExtractMethods<InstanceType<importModules[keyModules]>>;
type A = {
  [key in keyModules]: Actions;
};
/**
 * Хранилище состояния приложения
 */
class Store {
  services: Services;
  config: Partial<Config["store"]>;
  listeners: Function[];
  actions: Partial<Actions>;
  state: Partial<InitialState>;

  /**
   * @param services {Services}
   * @param config {Object}
   * @param initState {Object}
   */
  constructor(
    services: Services,
    config: Partial<Config["store"]> = {},
    initState: Partial<InitialState> = {}
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
    this.actions = {};
    for (const name of Object.keys(modules)) {
      this.actions[name] = new modules[name as keyModules](
        this,
        name as keyModules,
        this.config.modules[name] || {}
      );
      this.state[name as keyModules] = this.actions[name].initState();
    }
    console.log(this.actions);
  }

  /**
   * Создание копии стейта
   */
  make(name, base: keyModules) {
    this.actions[name] = new modules[base](
      this,
      name,
      { ...this.config?.modules[base], ...this.config?.modules[name] } || {}
    );
    this.state[name] = this.actions[name].initState();
  }

  /**
   * Удаление копии стейта
   */
  delete(name) {
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
  getState(): InitialState {
    return this.state as InitialState;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState: Partial<InitialState>, description = "setState") {
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
