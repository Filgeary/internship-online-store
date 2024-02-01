export default {
  /**
   * Открытие диалогового окна
   * @param name {Sting} Имя, например 'add-product'
   * @param option {Object} Опции:
   * { _id {Sting} Уникальный айдишник - если не задано, то используется `name`
   * айдишник позволит открыть одновременно два окна одного типа но с разным контентом
   * }
  */
  open: (name, option = {}) => {
    option.name = name;
    option._id ??= name;
    return {type: 'dialog/open', payload: option};
  },

  /**
   * Закрытие окна
   */
  close: () => {
    return {type: 'dialog/close'}
  },
}
