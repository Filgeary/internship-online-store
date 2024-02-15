import codeGenerator from '@src/utils/code-generator.js';
import * as modules from './exports';
import type Services from '@src/services';
import type { BasicModuleName, State, Actions, CopiedModuleName, StoreConfig, ModuleName } from './types';

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
    //@ts-ignore
    this.actions = {}
    //@ts-ignore
    this.state = initState || {}
    const modulesKeys = Object.keys(modules) as BasicModuleName[]  
    const create = <Name extends BasicModuleName>(name: Name) => {
      this.actions[name] = new (modules[name])(
        this, 
        name, 
        this.config.modules[name]
      ) as Actions[Name]
      if (initState?.[name]) {
        this.state[name] = initState[name]!
      } else {
        this.state[name] = this.actions[name].initState() as State[Name];
      }
    }
    for (const name of modulesKeys) {
      create(name as BasicModuleName)
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

  public makeModule<T extends BasicModuleName>(basicModuleName: T, moduleConfig?: Partial<StoreConfig['modules'][T]>): CopiedModuleName<T>{
    const newModuleName = `${basicModuleName}_${this.generateId()}` as CopiedModuleName<T>;
    this.actions[newModuleName] = new modules[basicModuleName](
      this, 
      newModuleName, 
      {
        ...this.config?.modules[basicModuleName],  
        ...moduleConfig
      } || {}
    ) as Actions[`${T}_${number}`];

    this.state[newModuleName] = this.actions[newModuleName].initState() as State[`${T}_${number}`];
    return newModuleName 
  }

  public deleteModule(moduleName: CopiedModuleName<BasicModuleName>): void {
    delete this.actions[moduleName]
    delete this.state[moduleName]
  }
}

export default Store;