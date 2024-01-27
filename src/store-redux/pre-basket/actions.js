export default {
  /**
   * Добавление активного элемента
   * @param item
   */
  setActive: (item) => {
    return {type: 'preBasket/set', payload: {item}};
  },

  /**
   * Добавление к активному элементу количества
   * @param count
   */
  setCountToAdd: (count) => {
    return {type: 'preBasket/setCount', payload: {count}}
  }
}
