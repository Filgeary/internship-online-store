import codeGenerator from '@src/utils/code-generator.js';
import * as modules from './exports';
import type Services from '@src/services';
import type { StoreConfig, State, Actions, Modules, ModuleNames } from './types';



/**
 * Хранилище состояния приложения
 */
class Store {

  protected state: State
  public services: Services
  protected listeners: Function[]
  protected config: StoreConfig
  protected generateId: Function
  public actions: Actions


  /**
   * @param services {Services}
   * @param config {Object}
   * @param initState {Object}
   */
  constructor(services: Services, config: StoreConfig, initState?: Partial<State>) {
    this.services = services;
    this.config = config;
    this.listeners = []; // Слушатели изменений состояния
    this.generateId = codeGenerator(1)
    this.actions = {} as Actions
    this.state = (initState || {}) as State
    const modulesKeys = Object.keys(modules) as (keyof Modules)[]  
    const create = <Name extends keyof Modules>(name: Name) => {
      const config = this.config.modules[name]
      this.actions[name] = new modules[name] (
        this, 
        name, 
        // @ts-ignore
        config
      ) as Actions[Name]
      if (initState?.[name]) {
        this.state[name] = initState[name]!
      } else {
        this.state[name] = this.actions[name].initState() as State[Name];
      }
    }
    for (const name of modulesKeys) {
      create(name)
    }
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  public subscribe(listener: Function): () => void {
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
  public getState(): State {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  public setState(newState: State, description: string = 'setState') {
    if (this.config.log) {
      console.group(
        `%c${'store.setState'} %c${description}`,
        `color: ${'#777'}; font-weight: normal`,
        `color: ${'#fff'}; font-weight: bold`,
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

  public makeModule<T extends keyof Modules>(
      basicModuleName: T, 
      moduleConfig?: Partial<StoreConfig['modules'][T]>  
  ): `${T}_${number}`{
    const newModuleName = `${basicModuleName}_${this.generateId()}` as `${T}_${number}`;
    this.actions[newModuleName] = new modules[basicModuleName](
      this, 
      newModuleName, 
      //@ts-ignore
      {
        ...this.config?.modules[basicModuleName],  
        ...moduleConfig
      }
    ) as Actions[`${T}_${number}`];

    this.state[newModuleName] = this.actions[newModuleName].initState() as State[`${T}_${number}`];
    return newModuleName 
  }

  public deleteModule(moduleName: `${keyof Modules}_${number}`): void {
    delete this.actions[moduleName]
    delete this.state[moduleName]
  }
}

export default Store;