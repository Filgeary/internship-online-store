import Services from '@src/services';
import * as modules from './exports';

import {
  IExtendedModules,
  TDefaultKeysModules,
  TGlobalActions,
  TGlobalState,
  TImportModules,
  TKeyModules,
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

  /**
   * @param services {Services}
   * @param config {Object}
   * @param initState {Object}
   */
  constructor(services: Services, config = {}, initState = {}) {
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
    const keys = Object.keys(modules) as TDefaultKeysModules[];
    for (const name of keys) {
      this.create(name);
    }
  }

  create<Key extends TDefaultKeysModules>(name: Key) {
    const moduleCreator = modules[name] as TImportModules[Key];
    const module = new moduleCreator(
      this,
      name,
      {} as any
    ) as TGlobalActions[Key];
    this.actions[name] = module;
    this.state[name] = this.actions[name].initState() as TGlobalState[Key];
  }

  /**
   * Создать копию, на основе существующего состояния
   * @param name {String}
   * @param base {String}
   */
  make(name: string, base: keyof typeof modules) {
    const configModule = this.config?.modules[
      name as keyof IExtendedModules
    ] as TConfigModules;

    this.actions[name] = new modules[base](
      this,
      name,
      {
        ...this.config?.modules[base],
        ...configModule,
      } || {}
    );
    this.state[name] = this.actions[name].initState();
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
