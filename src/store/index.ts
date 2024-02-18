import Services from "@src/services";
import * as modules from "./exports";
import {
  TStoreModuleConfigName,
  TState,
  TStoreBasicModuleName,
  TStoreConfig,
  TStoreModuleName,
  TStoreModules,
  TStoreNewModuleName,
} from "./types";

/**
 * Хранилище состояния приложения
 */
class Store {
  state: TState;
  services: Services;
  config: Partial<TStoreConfig>;
  listeners: (() => void)[];
  actions: TStoreModules;
  /**
   * @param services Сервисы
   * @param config Конфиг стора
   * @param initState начальный стейт
   */
  constructor(
    services: Services,
    config: Partial<TStoreConfig> = {},
    initState = {} as TState
  ) {
    this.services = services;
    this.config = config;
    this.listeners = []; // Слушатели изменений состояния
    this.state = initState;
    this.actions = {} as TStoreModules;
    // for (const name of Object.keys(modules)) {
    //   this.actions[name] = new modules[name](
    //     this,
    //     name,
    //     this.config?.modules[name] || {}
    //   );
    //   this.state[name] = this.actions[name].initState();
    // }
    const keys = Object.keys(modules) as TStoreBasicModuleName[];
    for (const name of keys) {
      this.create(name);
    }
  }

  // Создание state
  create<Key extends TStoreModuleName>(
    baseName: TStoreBasicModuleName & Key,
    configName: TStoreModuleConfigName = baseName,
    name: Key = baseName
  ) {
    this.actions[name] = new modules[baseName](
      this,
      name,
      //@ts-ignore
      this.config?.modules?.[configName] || {}
    ) as TStoreModules[Key];
    this.state[name] = this.actions[baseName].initState() as TState[Key];
  }

  // Создание нового state, на основе базового
  make(
    name: TStoreModuleName,
    base: TStoreBasicModuleName,
    configName: TStoreModuleConfigName
  ) {
    this.create(base, configName, name);
  }

  // create<Name extends TStoreModuleName>(name: Name) {
  //   this.actions[name] = new modules[name as TStoreModuleName](
  //     this,
  //     name,
  //     this.config.modules[name as TStoreModuleName] as TStoreConfig
  //   ) as TStoreModules[Name];
  //   this.state[name] = this.actions[name].initState() as TState[Name];
  // }

  // make(
  //   name: TStoreModuleName,
  //   base: TStoreBasicModuleName,
  //   configName: TStoreModuleConfigName
  // ) {
  //   this.create(base, configName, name);
  // }

  // Удаление state (всех, кроме базовых)
  delete(name: TStoreNewModuleName) {
    delete this.actions[name];
    delete this.state[name];
  }

  /**
   * Подписка слушателя на изменения состояния
   */
  subscribe(listener: () => void) {
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
  getState(): TState {
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
    // for (const listener of this.listeners) listener(this.state);
    for (const listener of this.listeners) listener();
  }
}

export default Store;
