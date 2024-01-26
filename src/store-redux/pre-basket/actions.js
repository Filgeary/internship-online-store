export default {
  /**
   * Добавление активного элемента
   * @param name
   */
  setActive: (item) => {
    return {type: 'preBasket/set', payload: {item}};
  },

  /**
   * Добавление к активному элементу количества
   * @param count
   */
  close: (count) => {
    return {type: 'preBasket/setCount', payload: {count}}
  }
}
