import * as modules from './exports.js';

/**
 * Хранилище состояния приложения
 */
class Store {

  /**
   * @param services {Services}
   * @param config {Object}
   * @param initState {Object}
   */
  constructor(services, config = {}, initState = {}) {
    this.services = services;
    this.config = config;
    this.listeners = []; // Слушатели изменений состояния
    this.state = initState;

    this.actions = {};
    for (const name of Object.keys(modules)) {
      this.actions[name] = new modules[name](this, name, this.config?.modules[name] || {});
      this.state[name] = this.actions[name].initState();
    }
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
  getState() {
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
      console.log(`%c${'prev:'}`, `color: ${'#d77332'}`, this.getState());
      console.log(`%c${'next:'}`, `color: ${'#2fa827'}`, newState);
      console.log(`%c${'localModules:'}`, `color: ${'#2fa827'}`, this.localModules);
      console.groupEnd();
    }
    this.state = newState;
    this.broadcast();
  }

  // Вызываем всех слушателей
  broadcast() {
    for (const listener of this.listeners) listener(this.getState());
  }

  createLocalStore(localModules) {
    const store = new Store(this.services, this.config);
    store.state = {};
    store.localModules = localModules
  
    localModules.forEach(moduleName => {
      store.state[moduleName] = this.actions[moduleName].initState()
      store.state[moduleName].local = true 
    });
    const globalModules = Object.keys(this.actions).filter(k => !localModules.includes(k))
    // globalModules.forEach(unusedName => {
    //   store.actions[unusedName].setState = (args) => {
    //     this.actions[unusedName].setState(args)
    //     store.broadcast()
    //   }
    // });

    globalModules.forEach(moduleName => {
      store.actions[moduleName] = this.actions[moduleName]
    });

    const unsubscribe = this.subscribe(() => store.broadcast())
    store.getState = () => {
      const own = Object.fromEntries(Object.entries(store.state).filter(m => localModules.includes(m[0])))
      const parent = Object.fromEntries(Object.entries(this.state).filter(m => globalModules.includes(m[0])))
      return {
        ...own, 
        ...parent
      }
    }
    return {store, unsubscribe}
  }

}


export default Store;
