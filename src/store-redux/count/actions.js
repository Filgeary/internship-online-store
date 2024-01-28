export default {
  /**
   * Добавление активного товара
   * @param item
   */
  setActive: (item) => {
    return { type: "count/setActive", payload: { item } };
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
