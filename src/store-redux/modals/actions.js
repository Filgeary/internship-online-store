export default {
  /**
   * Открытие модалки по названию
   * @param name
   */
  open: (name) => {
    return {type: 'modal/open', payload: {name}};
  },

  /**
   * Закрытие модалки
   * @param name
   */
  close: (name) => {
    return {type: 'modal/close', payload: {name}}
  }
}
