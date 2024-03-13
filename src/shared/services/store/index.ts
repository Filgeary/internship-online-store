import * as modules from './exports';
import {Config} from "@src/config";
import Services from "@src/services";
import {
  ActionsState,
  AllModules,
  AssembledActions,
  AssembledState,
  ExtendedModulesKey,
  StoreState, TModulesConfig
} from "@src/ww-old-store-postponed-modals/types";


/**
 * Хранилище состояния приложения
 */
class Store {
  services: Services;
  config: Config["store"];
  listeners: Function[];
  actions: AssembledActions;
  state: AssembledState;

  /**
   * Выбор состояния
   */
  constructor(
    services: Services,
    config = {} as Config["store"],
    initState = {} as AssembledState
  ) {
    this.services = services;
    this.config = config;
    this.listeners = [] as Function[]; // Слушатели изменений состояния
    this.state = initState;
    this.actions = {} as AssembledActions;
    const keys = Object.keys(modules) as AllModules[];
    for (const name of keys) {
      this.creating(name)
    }
  }

  creating<Key extends AllModules>(name: Key) {
    //@ts-ignore
    const module = modules[name];
    const config = this.config.modules[name]
    this.actions[name] = new module(this, name, config) as ActionsState[Key];
    this.state[name] = this.actions[name].initState() as StoreState[Key];
  }


  /**
   * Создание дубликата определенного state
   * @param name {String} - Имя, которое необходимо присвоить дубликату
   * @param base {String} - Имя state с которого будет происходить копирование
   * @param config {Object} - Какие-то параметры конфига
   * */
  makeCopy<T extends AllModules, Name extends ExtendedModulesKey<AllModules>>(name: Name, base: AllModules, config: TModulesConfig[T] = {} as TModulesConfig[T]) {
    // Возможно дубликат уже есть
    if (this.actions[name] && this.state[name]) {
      console.error("Дубликат с таким именем уже существует");
      return;
    }
    // Создаем новый конфиг, который будет использован в конструкторе, по умолчанию это конфиг по имени модуля, но можно передавать другие значения
    const newConfig: TModulesConfig[T] = this.config.modules[base] ? {...this.config.modules[base], ...config} : {...config};
    // Создаем конструктор модуля и проверяем есть ли там что-то/
    //@ts-ignore
    const moduleConstructor = modules[base];
    if (moduleConstructor) {
      this.actions[name] = new moduleConstructor(this, name, newConfig) as AssembledActions[Name];
      this.state[name] = this.actions[name].initState() as AssembledState[Name];
    } else {
      console.error(`Модуля с которого была попытка создать дубликат под именем: "${base}" не существует, проверьте правильно ли указан модуль`);
    }
  }

  deleteCopy(name: ExtendedModulesKey<AllModules>) {
    const defaultStore = Object.keys(modules) as AllModules[];
    // Проверка на то что это не один из основных модулей
    if (name in defaultStore) return console.error(`Вы пытаетесь удалить базовое состояние под именем: ${name}`)
    // Если данная копия была найдена в стейте, то удаляем ее
    if (name in this.state) {
      delete this.state[name]
    } else {
      console.error(`Данной копии модуля ${name} не было найдено, убедитесь в правильности имени`)
    }
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener: Function): () => void {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    }
  }


  getState(): AssembledState {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   * @param description {String}
   */
  setState(newState: any, description: string = 'setState') {
    if (this.config.log) {
      console.group(
        `%c${'ww-old-store-postponed-modals.setState'} %c${description}`,
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

export default Store;



