import Services from '@src/services';
import modules, { IGlobalActions, IGlobalState } from './exports';

import { TConfig } from '@src/config';

type TActions = IGlobalActions;
type TListeners = Array<(args: any | any[]) => void>;

/**
 * Хранилище состояния приложения
 */
class Store {
  services: Services;
  config: TConfig['store'];
  listeners: TListeners;
  state: IGlobalState;
  actions: TActions;

  /**
   * @param services {Services}
   * @param config {Object}
   * @param initState {Object}
   */
  constructor(services, config = {}, initState = {}) {
    this.services = services;
    this.config = config as TConfig['store'];
    this.listeners = []; // Слушатели изменений состояния
    this.state = initState as IGlobalState;
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
    for (const name in modules) {
      const instanceState = new modules[name](this, name, this.config?.modules[name] || {});
      this.actions[name] = instanceState;
      this.state[name] = this.actions[name].initState();
    }
  }

  /**
   * Создать копию, на основе существующего состояния
   * @param name {String}
   * @param base {String}
   */  
  make(name: string, base: string) {
    this.actions[name] = new modules[base](this, name, { ...this.config?.modules[base], ...this.config?.modules[name] } || {});
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
  getState(): IGlobalState {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState, description = 'setState') {
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

// const store = new Store();
// type TRootState = ReturnType<typeof store.getState>

export default Store;
