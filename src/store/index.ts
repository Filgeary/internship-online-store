import codeGenerator from '@src/utils/code-generator.js';
import * as modules from './exports';
import type Services from '@src/services';
import type { IActions, IBasicModuleName, ICopiedModuleName, IStoreState } from './types';
import type { Config } from '@src/config';

/**
 * Хранилище состояния приложения
 */
class Store {

  protected state: IStoreState
  public services: Services
  protected listeners: Function[]
  protected config: Config['store']
  protected generateId: Function
  public actions: IActions


  /**
   * @param services {Services}
   * @param config {Object}
   * @param initState {Object}
   */
  // @ts-ignore
  constructor(services: Services, config: Config['store'], initState: IStoreState = {}) {
    this.services = services;
    this.config = config;
    this.listeners = []; // Слушатели изменений состояния
    //@ts-ignore
    this.state = initState;
    this.generateId = codeGenerator(1)
    // @ts-ignore
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
  public subscribe(listener: Function): Function {
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
  public getState(): IStoreState {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  public setState(newState: IStoreState, description: string = 'setState') {
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
  private broadcast(): void {
    for (const listener of this.listeners) listener(this.getState());
  }

  public makeModule<T extends IBasicModuleName>(BasicModuleName: T, options: any): ICopiedModuleName<T>{
    const newSliceName = `${BasicModuleName}-${this.generateId()}` as ICopiedModuleName<T>;
    //@ts-ignore
    this.actions[newSliceName] = new modules[BasicModuleName](
      this, 
      newSliceName, 
      {
        //@ts-ignore
        ...this.config?.modules[BasicModuleName],  
        urlEditing: options.urlEditing || false
      } || {}
    );
    //@ts-ignore
    this.state[newSliceName] = this.actions[newSliceName].initState();
    return newSliceName 
  }

  public deleteModule(moduleName: ICopiedModuleName<IBasicModuleName>): void {
    delete this.actions[moduleName]
    delete this.state[moduleName]
  }
}

export default Store;
