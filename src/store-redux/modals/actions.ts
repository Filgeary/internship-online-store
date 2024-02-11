export default {
  /**
   * Открытие модалки по названию
   * @param name
   */
  open: (name: TModalsNames) => {
    return { type: 'modal/open', payload: { name } };
  },

  /**
   * Закрытие модалки
   * @param dataObj
   */
  close: (dataObj: any) => {
    return { type: 'modal/close', payload: dataObj };
  },

  /**
   * Сброс dataObj модалки
   */
  resetDataObj: () => {
    return { type: 'modal/resetDataObj' };
  },
};
