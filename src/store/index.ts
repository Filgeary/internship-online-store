import * as modules from './exports.js';
import ForkState from './fork';
import { theme } from './log-theme.js';
import StoreModule from './module.js';

// Вот такой вариант работает, но он не автоматический
type TState = {
  basket: ReturnType<modules.basket['initState']>;
  catalog: ReturnType<modules.catalog['initState']>;
  modals: ReturnType<modules.modals['initState']>;
  article: ReturnType<modules.article['initState']>;
  locale: ReturnType<modules.locale['initState']>;
  categories: ReturnType<modules.categories['initState']>;
  session: ReturnType<modules.session['initState']>;
  profile: ReturnType<modules.profile['initState']>;
  // Стейт форков у меня подключается отдельно
  forks: ReturnType<ForkState['initState']>;
}

// Дальше попытка это всё автоматизировать
type moduleType = typeof modules;

// Вот такая строка работает нормально, но в ней жёстко задано 'modules.basket'
type TTest1 = Record<keyof moduleType, ReturnType<modules.basket['initState']>>
// Вывод:
// type TTest1 = {
//    basket: IBasketInitState;
//    catalog: IBasketInitState;
//    modals: IBasketInitState;
//    ...
// }

// Попытки автоматизировать это дело уже не работают:
type TTest2<Type extends Partial<StoreModule>> = {
    [Property in keyof Type]: ReturnType<Type[Property]['initState']>
};

type TResult = TTest2<moduleType>
// Вывод:
// type TResult = {
//   basket: any;
//   catalog: any;
//   ...
// }

/**
 * Хранилище состояния приложения
 */
class Store {
  listeners: ((arg?: typeof this.state) => void)[];
  state: TState;
  //services;
  //config;
  //forks;
  //actions;
  [field: string]: any;

  /**
   * @param services {Services}
   * @param config {Object}
   * @param initState {Object}
   */
  constructor(services, config = {}, initState = {}) {
    this.services = services;
    this.config = config;
    this.forks = [];
    this.listeners = []; // Слушатели изменений состояния
    this.state = initState as typeof this.state;
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
    this.actions = {};
    for (const name of Object.keys(modules)) {
      this.actions[name] = new modules[name](this, name, this.config?.modules[name] || {});
      this.state[name] = this.actions[name].initState();
    }

    // Позволяет отделять оригиналы от форков, реагировать на удаление форка и содержит информацию для отладки.
    // Добавляем отдельно, потому что это не часть контента сайта, а часть механизма стора
    this.actions.forks = new ForkState(this, 'forks', this.config?.modules.forks || {});
    this.state.forks = this.actions.forks.initState();
  }

  /**
   * Создает новый форк среза стора
   * @param name {String}
   * @param parent {String}
   * @param opt {Object} - {_id, configName, initStateName, initState}
   */
  fork(name, parent, opt: Record<string, any> = {}) {
    opt.configName ??= parent;
    opt.initStateName ??= name;
    opt.initState ??= null;
    opt._id ??= name;
    // Родитель должен существовать
    const isParentExist = Boolean(this.state[parent])
    if (!isParentExist) throw Error(`Попытка fork('${name}, ${parent}'), '${parent}' не существует!`);
    // Форк не должен существовать
    const isForkExist = Boolean(this.state[name]);
    if (isForkExist) throw Error(`Попытка fork('${name}, ${parent}'), '${name}' уже существует!`);
    // Клонируем экшены
    this.actions[name] = new modules[parent](this, name, this.config?.modules[opt.configName] || {});
    // Создаем новый стейт
    const newState = { ...this.state };
    newState[name] = opt.initState ?? this.actions[opt.initStateName].initState();
    // Обновляем форки
    newState.forks = { ...newState.forks };
    newState.forks.list = [...newState.forks.list, { name, parent, options: opt }];
    // Обновляем стейт
    this.setState(newState, `Добавлен форк ${name}`);
  }

  /**
   * Удаляет форк среза стора
   * @param name {String}
   */
  removeFork(name) {
    // Форк должен существовать
    const isForkExist = Boolean(this.state[name]);
    if (!isForkExist) throw Error(`Попытка removeFork('${name}'), '${name}' и так не существует!`);
    // Предотвращаем удаление оригинала по ошибке
    const isFork = Boolean(this.state.forks.list.find(fork => fork.name === name));
    if (!isFork) throw Error(`Попытка removeFork('${name}'), '${name}' не является форком!`);
    // Создаем новый стейт
    const newState = { ...this.state };
    // Удаляем форк из стейта
    delete newState[name];
    // Удаляем из массива форков
    newState.forks = { ...newState.forks };
    newState.forks.list = newState.forks.list.filter((fork) => fork.name !== name);
    // Обновляем стейт
    this.setState(newState, `Удалён форк ${name}`);
    // Удаляем экшены
    delete this.actions[name];
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
    // Добавил поддержку тёмной темы, а то ничего не видно было
    if (this.config.log) {
      console.group(
        `%c${'store.setState'} %c${description}`,
        `color: ${theme.color1}; font-weight: normal`,
        `color: ${theme.color2}; font-weight: bold`,
      );
      console.log(`%c${'prev:'}`, `color: ${theme.color3}`, this.state);
      console.log(`%c${'next:'}`, `color: ${theme.color4}`, newState);
      console.groupEnd();
    }
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener(this.state);
  }
}

export default Store;
