import * as modules from './exports'
import { IConfig } from '../config'
import Services from '../services' 
import type { Actions, StoreState, ImportModules, IKeysModules, TActions } from './types.ts'

/**
 * Хранилище состояния приложения
 */
class Store {
  services: Services
  config: IConfig["store"]
  listeners: Array<((...arg: any[]) => void)>
  actions: Actions & Record<string, any>
  state: StoreState  & Record<string, any>
  initialStateFromServer: object

  constructor(
    services: Services,
    // config = {} as IConfig["store"],
    config: IConfig | {} = {},
    initState = {},
  ) {
    this.services = services
    this.config = config as IConfig["store"]
    this.listeners = [] // Слушатели изменений состояния
    this.state = initState as StoreState
    this.initialStateFromServer = {...initState}
    /** @type {{
     * basket: BasketState,
     * catalog: CatalogState,
     * modals: ModalsState,
     * article: ArticleState,
     * locale: LocaleState,
     * categories: CategoriesState,
     * session: SessionState,
     * profile: ProfileState,
     * catalog-modal: CatalogModalState,
     * countries: CountriesState,
     * chat: ChatState
     * canvas: CanvasState
     * }} */
    this.actions = {} as Actions
    const keys = Object.keys(modules) as IKeysModules[]
    for (const name of keys) {
      this.create(name)
      const storeModule = this.actions[name]
      console.log('storeModule', storeModule)
      console.log('storeModule', storeModule.name)
    }
    console.log("this.initialStateFromServer", this.initialStateFromServer)
  }

  create<Key extends IKeysModules>(name: Key) {
    const b = modules[name] as ImportModules[Key]
    const a = new b(this, name, this.config?.modules.session || {}) as Actions[Key]
    this.actions[name] = a
    this.state[name] = this.actions[name].initState() as StoreState[Key]
  }


  /**
   * Удаление копии стейта
   */
  delete<Key extends IKeysModules>(name: Key) {
    delete this.actions[name]
    delete this.state[name]
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
      this.listeners = this.listeners.filter((item) => item !== listener)
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
  getState(): StoreState {
    return this.state as StoreState;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState: StoreState, description = "setState") {
    if (this.config.log) {
      console.group(
        `%c${"store.setState"} %c${description}`,
        `color: ${"#777"}; font-weight: normal`,
        `color: ${"#333"}; font-weight: bold`
      );
      console.log(`%c${"prev:"}`, `color: ${"#d77332"}`, this.state);
      console.log(`%c${"next:"}`, `color: ${"#2fa827"}`, newState);
      console.groupEnd();
    }
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener(this.state);
  }
}

export default Store;

