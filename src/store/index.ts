import Services from '@src/services';
import * as modules from './exports.js';
import ForkState from './fork';
import { theme } from './log-theme';
import { type TContext } from '@custom-types/context';
import { TConfig } from '@src/config.js';

export type TModulesType = typeof modules;
export type TModulesNamesPartial = keyof typeof modules;

/**
 * Имена всех модулей включая возможно созданные на основе контекстов
 */
export type TModulesNames = TModulesNamesPartial | 'forks' | TContext;

type TActionsPartial = { [Key in TModulesNamesPartial]: InstanceType<TModulesType[Key]> };
type TStatePartial = { [Key in keyof TActionsPartial]: ReturnType<TActionsPartial[Key]['initState']> };

export type TActions = TActionsPartial
  & { ['forks']: ForkState } // Стейт форков ForkState подключается отдельно, потому что это не часть контента сайта, а часть механизма стора.
  & { [Key in TContext]: InstanceType<TModulesType[TModulesNamesPartial]> }; // Модули, которые могут быть созданы методом `.fork()`

export type TState = TStatePartial
  & { ['forks']: ReturnType<ForkState['initState']> } // Стейт форков ForkState подключается отдельно, потому что это не часть контента сайта, а часть механизма стора.
  & { [Key in TContext]: InstanceType<TModulesType[TModulesNamesPartial]> }; // Модули, которые могут быть созданы методом `.fork()`

/**
 * Информация о существующих в данный момент форках стейта и их начальных настройках.
 */
type TForkData= {
  name: TModulesNames;
  parent: TModulesNamesPartial;
  options: Record<string, any>
}

/**
 * Хранилище состояния приложения
 */
class Store {
  listeners: ((arg?: typeof this.state) => void)[];
  state: TState;
  services: Services;
  config: TConfig;
  forks: TForkData[];
  actions: TActions;

  /**
   * @param services {Services}
   * @param config {Object}
   * @param initState {Object}
   */
  constructor(services: Services, config = {}, initState: TState = {} as TState) {
    this.services = services;
    this.config = config;
    this.forks = [];
    this.listeners = []; // Слушатели изменений состояния
    this.state = initState;
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
    for (const name of Object.keys(modules)) this.createModule(name as keyof TModulesType);

    // Позволяет отделять оригиналы от форков, реагировать на удаление форка и содержит информацию для отладки.
    // Добавляем отдельно, потому что это не часть контента сайта, а часть механизма стора
    this.actions.forks = new ForkState(this, 'forks' as TModulesNames, this.config?.modules.forks || {});
    this.state.forks = this.actions.forks.initState();
  }

  createModule<Key extends keyof TModulesType>(name: Key) {
    let module = modules[name] as TModulesType[Key];
    this.actions[name] = new module(this, name as TModulesNames, this.config?.modules[name] || {} as any) as TActions[Key];
    this.state[name] = this.actions[name].initState() as TState[Key];
  }

  /**
   * Создает новый форк среза стора
   * @param name {String}
   * @param parent {String}
   * @param opt {Object} - {_id, configName, initStateName, initState}
   */
  fork<Name extends TModulesNames>(name: Name, parent: TModulesNamesPartial, opt: Record<string, any> = {}) {
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
    this.actions[name] = new modules[parent](this, name, this.config?.modules[opt.configName] || {}) as TActions[Name];
    // Создаем новый стейт
    const newState = { ...this.state };
    newState[name] = opt.initState as TState[Name] ?? (this.actions[(opt.initStateName as keyof TActions)]).initState() as TState[Name];
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
  removeFork(name: TModulesNames) {
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
  subscribe(listener: (arg?: typeof this.state) => void) {
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
  setState(newState: TState, description = 'setState') {
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
