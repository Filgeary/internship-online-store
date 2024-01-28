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
  close: (result = null) => {
    return {type: 'modal/close', payload: {result}}
  },

  /**
   * Сброс результатов модалок
   */
  resetModalResult: () => {
    return {type: 'modal/reset-result'};
  }
}
