import Services from "@src/services.ts";
import * as modules from "./exports.ts";
import { TConfig } from "@src/config.ts";
import { TActions, TImportModules, TKeyModules, TStoreState } from "./types.ts";

/* 
create<Key extends keyModules>(name: Key) {
    let b = modules[name] as importModules[Key];
    let a = new b(this, name,import { TConfig } from '@src/config';
 {} as any) as Actions[Key];import { TStoreState } from '@src/store/types';

    this.actions[name] = a;
    this.state[name] = this.actions[name].initState() as StoreState[Key];
  }
   */

/**
 * Хранилище состояния приложения
 */
class Store {
  services: Services;
  config: TConfig["store"];
  listeners: Function[];
  state: TStoreState & Record<string, any>;
  actions: TActions;

  /**
   * @param services {Services}
   * @param config {Object}
   * @param initState {Object}
   */
  constructor(
    services: Services,
    config = {} as TConfig["store"],
    initState = {} as TStoreState
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
    this.actions = {} as TActions;
    for (const name of Object.keys(modules) as TKeyModules[]) {
      this.create(name);
    }
  }

  create<Key extends TKeyModules>(name: Key) {
    let b = modules[name] as TImportModules[Key];
    let a = new b(this, name, {} as any) as TActions[Key];
    this.actions[name] = a;
    this.state[name] = this.actions[name].initState() as TStoreState[Key];
  }

cr<Key extends TKeyModules>(name: Key, base:Key){
  let b = modules[name] as TImportModules[Key];
  let c = modules[base] as TImportModules[Key];
  let a = new c(this, name, {} as any) as TActions[Key];
  let d = new b(this, name, {} as any) as TActions[Key];
  this.actions[name] = d;

}

  make(name: string | number, base: string | number) {

    this.actions[name] = new modules[base](
      this,
      name,
      this.config?.modules[base] || {}
    );
    this.state[name] = this.actions[name].initState();
  }

  clear(name:string ) {
    this.state[name] = this.actions[name].initState();
  }
  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener: {
    (...args: any ): void;
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
  getState():TStoreState {
    return this.state as TStoreState;
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
    this.state = newState as TStoreState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener(this.state);
  }
}

export default Store;
