import StoreModule from "../module";
import codeGenerator from "@src/utils/code-generator";

class ModalsState extends StoreModule {

  initState() {
    return {
      modalsList: [],
    }
  }

  /**
   * Открытие модалки по имени
   * @param name {String} - имя модалки которую необходимо открыть
   * @param data {Object} - данные для модалки
   * @return {Promise} - результатом будет промис, который будет ожидать вызова "resolve" в модальном окне
   * @description Как это будет работать, для умных модальных окон по типу корзины можно просто вызвать открытие по названию
   * так как эти модальные окна сами будут получать данные, если жу модальное окно "глупое"
   * в него необходимо передать определенные данные, после обработки данных внутри модалки необходимо выполнить resolve,
   * чтобы прокинуть данные, с помощью await можно ожидать выполнение промиса
   * @example
   * handler () => {
   *  const result = await store.actions.modals.open(name, data)
   *  // Любая логика для обработки данных
   * }
   *
   * В самом модальном окне:
   *
   * handler(value) => {
   * //
   *  props.data.resolve(value)
   * }
   *  */
  open(name, data = {}) {
    // Код для каждого элемента
    return new Promise((resolve) => {
      // Обновляем state модальных окон
      this.setState({
        // Я решил что для множества модальных окон будет логично хранить все в обьектах, каждому модальному окну свой обьект в котором будет функция завершения промиса
        modalsList: [...this.getState().modalsList, {name, data, resolve}]
      }, `Открытие модалки с именем: ${name} и уровнем ${this.getState().modalsList + 1}`)
    })
      .then((result) => {
        return result;
      })
  }

  close(result) {
    const modalsList = this.getState().modalsList;
    modalsList[modalsList.length - 1].resolve(result)
    this.setState({
      modalsList: this.getState().modalsList.slice(0, -1),
    }, `Закрытие модалки уровня ${this.getState().modalsList.length}`);
  }
}

export default ModalsState;
