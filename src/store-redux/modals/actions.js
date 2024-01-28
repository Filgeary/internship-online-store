export default {
  /**
   * Открытие модалки по названию
   * @param name
   */
  open: (name, title) => {
    return { type: "modal/open", payload: { name, title } };
  },

  /**
   * Закрытие модалки
   * @param name
   */
  close: () => {
    return { type: "modal/close" };
  },
};
