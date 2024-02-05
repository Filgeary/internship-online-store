export default {
  /**
   * Открытие диалогового окна
   * @param name {Sting} Имя, например 'add-product'
   * @param okCallback {Function} Обработка успешного результата
   * @param option {Object} Опции:
   * { _id {Sting} Уникальный айдишник - если не задано, то используется `name`
   * айдишник позволит открыть одновременно два окна одного типа но с разным контентом
   * }
  */
  open: (name, okCallback, option = {}) => {
    option.name = name;
    option.ok = okCallback;
    option._id ??= name;
    return {type: 'dialog/open', payload: option};
  },

  /**
   * Закрытие окон
   * @param _id {Sting|Sting[]|undefined} Имя/id, например 'add-product', или массив id: `['add-product', 'add-product2']`.
   * Если ничего не передано, то будет закрыто верхнее окно.
   */
  close: (_id) => {
    const idArray = typeof _id === 'string' ? [_id] : _id;
    return {type: 'dialog/close', payload: idArray}
  },

  /**
   * Закрытие всех окон
   */
  closeAll: () => {
    return {type: 'dialog/closeAll'}
  },
}
