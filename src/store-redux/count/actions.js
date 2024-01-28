export default {
  /**
   * Добавление активного товара
   * @param item
   */
  setActive: (_id) => {
    return { type: "count/setActive", payload: { _id } };
  },

  /**
   * Установка  количества товара
   * @param count
   */
  setCount: (count) => {
    return { type: "count/setCount", payload: { count } };
  },

  /**
   * Сброс активного товара
   */
  reset: () => {
    return { type: "count/reset" };
  },
};
