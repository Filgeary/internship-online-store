export default {
  /**
   * Модалка для выбора количества товара по id
   * @param id
   * @param count
   */
  open: (id) => {
    return {type: 'adding/open', payload: {id}};
  },

  /**
   * Установка количества товара по выбранному id
   * @param count
   */

  set: (count) => {
    return {type: 'adding/set', payload: {count}}
  },

  /**
   * Сброс параметров
   */
  close: () => {
    return {type: 'adding/close'}
  }
}
