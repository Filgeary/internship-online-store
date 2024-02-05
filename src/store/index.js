import codeGenerator from '@src/utils/code-generator.js';
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
    this.generateId = codeGenerator(1)
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
      console.groupEnd();
    }
    this.state = newState;
    this.broadcast();
  }

  // Вызываем всех слушателей
  broadcast() {
    for (const listener of this.listeners) listener(this.getState());
  }

  makeSlice(baseSliceName, options) {
    const newSliceName = `${baseSliceName}-${this.generateId()}`
    this.actions[newSliceName] = new modules[baseSliceName](
      this, 
      newSliceName, 
      {
        ...this.config?.modules[baseSliceName],  
        urlEditing: options.urlEditing || false
      } || {}
    );
    this.state[newSliceName] = this.actions[newSliceName].initState();
    return newSliceName
  }

  deleteSlice(sliceName) {
    if (this.actions[sliceName].subscriptions.length) {
      this.actions[sliceName].subscriptions.forEach(unsubscribe => {
        unsubscribe()
      });
    }
    delete this.actions[sliceName]
    delete this.state[sliceName]
  }
}

export default Store;
