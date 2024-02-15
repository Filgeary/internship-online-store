import Services from '@src/services';
import * as modules from './exports';

import {
  TDefaultKeysModules,
  TExtendedKeysModules,
  TGlobalActions,
  TGlobalState,
  TImportModules,
} from './types';

import { TConfig, TConfigModules } from '@src/config';

type TListeners = Array<(...args: any[]) => void>;

/**
 * Хранилище состояния приложения
 */
class Store {
  services: Services;
  config: TConfig['store'];
  listeners: TListeners;
  state: TGlobalState & Record<string, any>;
  actions: TGlobalActions & Record<string, any>;

  constructor(services: Services, config: TConfig | {} = {}, initState = {}) {
    this.services = services;
    this.config = config as TConfig['store'];
    this.listeners = []; // Слушатели изменений состояния
    this.state = initState as TGlobalState;
    /** {{
     * basket: BasketState,
     * catalog: CatalogState,
     * modals: ModalsState,
     * article: ArticleState,
     * locale: LocaleState,
     * categories: CategoriesState,
     * session: SessionState,
     * profile: ProfileState
     * }} */
    this.actions = {} as TGlobalActions;
    const modulesKeys = Object.keys(modules) as TDefaultKeysModules[];
    for (const name of modulesKeys) {
      this.create(name);
    }
  }

  /**
   * Инициализация изначального состояния
   * @param name {String}
   */
  create<Key extends TDefaultKeysModules>(name: Key) {
    const moduleCreator = modules[name] as TImportModules[Key];
    const module = new moduleCreator(this, name, {} as any) as TGlobalActions[Key];
    this.actions[name] = module;
    this.state[name] = this.actions[name].initState() as TGlobalState[Key];
  }

  /**
   * Создать копию, на основе существующего состояния
   * @param name {String}
   * @param base {String}
   * @param configByName {String} Какой из конфигов по имени использовать
   */
  createStore(name: string, base: keyof typeof modules, configByName?: keyof TConfigModules) {
    const configName = configByName || name;
    const configModule = this.config?.modules[configName as keyof TConfig['store']['modules']];

    this.actions[name] = new modules[base](
      this,
      name as TExtendedKeysModules,
      {
        ...this.config?.modules[base as keyof TConfig['store']['modules']],
        ...configModule,
      } || {}
    );
    this.state[name] = this.actions[name].initState();
  }

  /**
   * Удалить стор по имени
   */
  deleteStore(name: string) {
    delete this.actions[name];
    delete this.state[name];
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }

  /**
   * Выбор состояния
   */
  getState(): TGlobalState {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState: TGlobalState, description: string = 'setState') {
    if (this.config.log) {
      console.group(
        `%c${'store.setState'} %c${description}`,
        `color: ${'#777'}; font-weight: normal`,
        `color: ${'#333'}; font-weight: bold`
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

// const store = new Store();
// type TRootState = ReturnType<typeof store.getState>

export default Store;
