export default {
  /**
   * Открытие модалки по названию
   * @param name
   */
  open: (name) => {
    return { type: 'modal/open', payload: { name } };
  },

  /**
   * Закрытие модалки
   * @param dataObj
   */
  close: (dataObj) => {
    return { type: 'modal/close', payload: dataObj };
  },

  /**
   * Сброс dataObj модалки
   */
  resetDataObj: () => {
    return { type: 'modal/resetDataObj' };
  },
};
