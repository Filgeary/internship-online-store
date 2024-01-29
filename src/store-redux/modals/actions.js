export default {
  /**
   * Открытие модалки по названию
   * @param name {String}
   * @param data {Object}
   */
  open: (name, data) => {
    return {type: 'modal/open', payload: {name, data}};
  },

  /**
   * Закрытие модалки
   */
  close: () => {
    return {type: 'modal/close'}
  }
}
