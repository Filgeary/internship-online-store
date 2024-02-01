export default {
  /**
   * Пометим окно как открытое (waiting) и сбросим данные
   */
  open: () => {
    return { type: 'addManyProducts/open' }
  },

  /**
   * Выделить товар или снять выделение, если он уже выделен
   * @param item {Object}
   */
  selectItem: (item) => {
    return { type: 'addManyProducts/selectItem', payload: { item } }
  },

  /**
   * Установка количества штук товара
   * @param _id {String}
   * @param pcs {String}
   */
  setPcs: (_id, pcs) => {
    return { type: 'addManyProducts/setPcs', payload: { _id, pcs } }
  },

  /**
   * Установка какая из кнопок была нажата ("Добавить выбранные" или "Отмена")
   * @param result {Boolean}
   */
  setResult: (result) => {
    return { type: 'addManyProducts/setResult', payload: { result } }
  },
}
