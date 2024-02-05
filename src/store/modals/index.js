import StoreModule from "../module";
import codeGenerator from "@src/utils/code-generator";

class ModalsState extends StoreModule {

  initState() {
    return {
      modalsList: [],
      // Здесь будет лежать уникальный id
      unId: codeGenerator()
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
    const _id = this.getState().unId()
    // Промис с возвратом значения
    return new Promise((resolve) => {
      // Обновляем state модальных окон, добавляя новое
      this.setState({
        ...this.getState(),
        modalsList: [...this.getState().modalsList, {name, data, resolve, _id}]
      }, `Открытие модалки с именем: ${name} и уровнем ${this.getState().modalsList + 1}`)
    })
      .then((result) => {
        return result;
      })
  }

  /**
   * Закрытие модального окна по id с передачей результата
   * @param result {any}
   * @param _id {Number}
   *
   * */
  close(result, _id) {
    // Поиск модального окна по id вызов у него функции resolve с параметрами и удаление этого модального окна
    const newModalsList = this.getState().modalsList.filter(modal => {
      if(modal._id === _id) modal.resolve(result)
      return modal._id !== _id
    })
    this.setState({
      ...this.getState(),
      modalsList: newModalsList
    }, `Закрытие модалки уровня ${this.getState().modalsList.length}`);
  }
}

export default ModalsState;
