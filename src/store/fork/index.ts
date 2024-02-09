/* eslint-disable class-methods-use-this, import/no-default-export */
import StoreModule from '../module';
import { type IForkInitState } from './types';

/**
 * Позволяет отделять оригиналы от форков, реагировать на удаление форка и содержит информацию для отладки
 * Пример содержимого:
 * {
 *   name: "myFork",
 *   parent: "catalog",
 *   options: {
 *     _id: "myFork"
 *     configName: "catalog",
 *     initStateName: "myFork",
 *     initState: null,
 *   },
 * }
 */
class ForkState extends StoreModule {
  initState(): IForkInitState {
    return {
      list: [],
    };
  }
}

export default ForkState;
