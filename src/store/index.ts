
import Services from '../services.js';
import { ConfigModulesType, ConfigStoreType } from '../types/config.js';
import * as modules from './exports.js';
import { ExtendedModulesKeys, ModulesKeys, StoreActionsType, StoreStateType } from './types.js';


/**
 * Хранилище состояния приложения
 */
class Store {
  preloaded: boolean;
  services: Services;
  config: ConfigStoreType;
  actions: StoreActionsType;
  state: StoreStateType;
  listeners: Function[];

  /**
   * @param services {Services}
   * @param config {Object}
   * @param initState {Object}
   */
  constructor(services: Services, config: ConfigStoreType, initState:StoreStateType = undefined) {
    this.services = services;
    this.config = config;
    this.listeners = []; // Слушатели изменений состояния
    this.actions = {} as StoreActionsType;

    if(!initState) {
      this.state = {} as StoreStateType;
      this.preloaded = false;
    } else {
      this.state = initState;
      this.preloaded = true;
    }

    for (const name of Object.keys(modules) as ModulesKeys[]) {
      this.create(name)
      // this.actions[name] = new modules[name as StoreModulesKeys](this, name as StoreModulesKeys, this.config?.modules[name] || {});
      // this.state[name] = this.actions[name as StoreModulesKeys].initState();
    }

  }

  create<Key extends ModulesKeys>(name: Key) {
    let a = this.config?.modules[name] as ConfigModulesType[Key];
    this.actions[name] = new modules[name](this, name, a) as StoreActionsType[Key];
    if(!this.state[name])
      this.state[name] = this.actions[name].initState() as StoreStateType[Key];
  }

  createModule<Key extends ExtendedModulesKeys<U>, U extends ModulesKeys>(name: Key, base: ModulesKeys) {
    this.actions[name] = new modules[base](this, name, this.config?.modules[base] || {} ) as StoreActionsType[Key];
    this.state[name] = this.actions[name].initState() as StoreStateType[Key];
  }

  deleteModule<Key extends ExtendedModulesKeys<U>, U extends ModulesKeys>(name: Key) {
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
