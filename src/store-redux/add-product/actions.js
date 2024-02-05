export default {
  /**
   * Установка контента, который будет отображаться в диалоговом окне
   * @param item {Object}
   */
  setData: (item) => {
    return { type: 'addProduct/setData', payload: { item } }
  },

  /**
   * Установка количества штук товара
   * @param pcs {String}
   */
  setPcs: (pcs) => {
    return { type: 'addProduct/setPcs', payload: { pcs } }
  },

  /**
   * Установка какая из кнопок была нажата ("Ок" или "Отмена")
   * @param result {Boolean}
   */
  setResult: (result) => {
    return { type: 'addProduct/setResult', payload: { result } }
  },
}
