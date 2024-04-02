/* eslint-disable import/namespace */
import * as modules from './exports';

import type { TServices } from '@src/services';

export type TTypeOfModules = typeof modules;
export type TKeyOfModules = keyof TTypeOfModules;
export type TExtendedKeyOfModules<T extends TKeyOfModules> = T | `${T}${number}`;

export type TStore = Store;

export type TActions = {
  [name in TKeyOfModules as TExtendedKeyOfModules<name>]: InstanceType<TTypeOfModules[name]>;
};

export type TRootState = {
  [name in TKeyOfModules as TExtendedKeyOfModules<name>]: ReturnType<TActions[name]['initState']>;
};

export type TAllConfigs = {
  [name in TKeyOfModules]: ReturnType<TActions[name]['initConfig']>;
};

export type TKeyOfServices = keyof Omit<TServices, 'config'>;

export type TConfig = {
  redux: Record<string, any>;
  api: {
    baseUrl: string;
  };
  store: {
    log: boolean;
    modules: TAllConfigs;
  };
  ssr: {
    isActive: boolean;
  };
};

/**
 * Хранилище состояния приложения
 */
class Store {
  services: TServices;
  config: TConfig['store'];
  state: TRootState;
  listeners: Function[];
  actions: TActions;

  constructor(
    services: TServices,
    config = {} as TConfig['store'],
    initState = {} as TRootState, // usually from SSR
  ) {
    this.services = services;
    this.config = config as TConfig['store'];
    this.listeners = [];
    this.state = {} as TRootState;
    this.actions = {} as TActions;
    this.state = { ...this.state, ...structuredClone(initState) };
    for (const moduleName of Object.keys(modules) as TKeyOfModules[]) {
      this.initModule(moduleName, initState[moduleName]);
    }
    console.log('🚀 => Store => this.state:', this.state);
  }

  initModule<ModuleName extends TKeyOfModules>(
    name: ModuleName,
    initState?: TRootState[ModuleName],
  ) {
    if (!this.actions[name]) {
      if (!modules[name]) {
        throw new Error(`Module ${name} not found`);
      }

      const moduleConstructor = modules[name] as TTypeOfModules[ModuleName];
      const newModule = new moduleConstructor(
        this,
        name,
        this.config?.modules[name] || {},
      ) as TActions[ModuleName];
      this.actions[name] = newModule;
      this.state[name] = initState
        ? (this.actions[name].setState(
            initState as any,
            `initModule: ${name}`,
          ) as unknown as TRootState[ModuleName])
        : (this.actions[name].initState() as TRootState[ModuleName]);
    }
  }

  createSlice<T extends TExtendedKeyOfModules<TKeyOfModules>, U extends TKeyOfModules>(
    name: T,
    baseName: U,
  ) {
    const module = modules[baseName] as TTypeOfModules[U];
    const newModule = new module(
      this,
      name as TKeyOfModules,
      this.config?.modules[baseName] || {},
    ) as TActions[T];
    this.actions[name] = newModule;
    this.state[name] = this.actions[baseName].initState() as TRootState[T];
  }

  deleteSlice(name: TExtendedKeyOfModules<TKeyOfModules>) {
    delete this.actions[name];
    delete this.state[name];
  }

  hasSlice(name: TExtendedKeyOfModules<TKeyOfModules>) {
    return Boolean(this.state[name]);
  }

  subscribe(listener: Function) {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  }

  getState() {
    return this.state;
  }

  setState(newState: TRootState, description = 'setState') {
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

export default Store;
