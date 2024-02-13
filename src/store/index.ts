import Services from '@src/services.js';
import * as modules from './exports';
import { BasicStoreModuleKeys, StoreCopyModuleKeys, StoreInitStates, StoreModuleKeys, StoreModules } from './types.js';
import { StoreConfig, StoreConfigModulesKeys } from '@src/types.js';

/**
 * Хранилище состояния приложения
 */
class Store {
  services: Services;
  config: Partial<StoreConfig>;
  listeners: (() => void)[];
  state: StoreInitStates;
  actions: StoreModules;

  /**
   * @param services {Services}
   * @param config {Object}
   * @param initState {Object}
   */
  constructor(services: Services, config: Partial<StoreConfig> = {}, initState: StoreInitStates = {} as StoreInitStates) {
    this.services = services;
    this.config = config;
    this.listeners = []; // Слушатели изменений состояния
    this.state = initState as StoreInitStates;
    /** @type {{
     * basket: BasketState,
     * catalog: CatalogState,
     * modals: ModalsState,
     * article: ArticleState,
     * locale: LocaleState,
     * categories: CategoriesState,
     * session: SessionState,
     * profile: ProfileState
     * catalogModal: CatalogModalState
     * }} */
    this.actions = {} as StoreModules;
    const keys = Object.keys(modules) as BasicStoreModuleKeys[];
    for (const name of keys) {
      this.#create(name);
    }
  }

  // Создание state
  #create<Key extends StoreModuleKeys>(baseName: BasicStoreModuleKeys & Key, configName: StoreConfigModulesKeys = baseName, name: Key = baseName) {
    this.actions[name] = new modules[baseName](this, baseName, this.config?.modules?.[configName] || {}) as StoreModules[Key];
    this.state[name] = this.actions[baseName].initState() as StoreInitStates[Key];
  }

  // Создание нового state, на основе базового
  make(name: StoreModuleKeys, base: BasicStoreModuleKeys, configName: StoreConfigModulesKeys) {
    this.#create(base, configName, name);
  }

  // Удаление state (всех, кроме базовых)
  remove(name: StoreCopyModuleKeys) {
    delete this.actions[name];
    delete this.state[name];
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener: (() => void)) {
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
   * catalogModal: Object,
   * }}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState: StoreInitStates, description = 'setState') {
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
    // for (const listener of this.listeners) listener(this.state);
    for (const listener of this.listeners) listener();
  }
}

export default Store;
