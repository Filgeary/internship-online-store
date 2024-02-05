import StoreModule from "./module";

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

  initState() {
    return {
      list: []
    };
  }
}

export default ForkState;
