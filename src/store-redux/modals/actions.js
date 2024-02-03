export default {
  /**
   * Открытие модалки по названию
   * @param name
   */
  open: (name, id) => {
    return { type: "modal/open", payload: { name } };
  },

  /**
   * Закрытие модалки
   * @param name
   * @param data
   */
  close: (name, data) => {
    return { type: "modal/close", payload: { name, data } };
  },

  /**
   * Очистка/сброс data
   */
  reset: () => {
    return { type: "modal/reset" };
  },
};
