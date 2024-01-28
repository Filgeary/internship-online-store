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
  close: () => {
    return {type: 'modal/close'}
  },

/**
 * Статус открытости модального окна
 * @param status
 */
  changeActiveModal: (status) => {
    return {type: 'modal/active', payload: {status}}
  }
}
