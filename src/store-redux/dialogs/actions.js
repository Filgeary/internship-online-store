export default {
  /**
   * Открытие диалогового окна
   * @param name {Sting} Имя, например 'add-product'
   * @param title {Sting} Заголовок, например 'Добавить в корзину'
   * @param _id {Sting} Уникальный айдишник
   * @param content {Object} данные для окна, например item с информацией о товаре.
   * Объект должен содержать поле _id с уникальным ключем.
   * @param result {Object} позволяет задать начальное значение результата,
   * которое пользователь затем может изменить.
  */
  open: ({ name, title, _id, content, result = {} }) => {
    return {type: 'dialog/open', payload: {name, title, _id, content, result}};
  },

  /**
   * Обновление данных вводимых/изменяемых пользователем в диалоговом окне
   * @param result {Object}
   */
  update: (result) => {
    return {type: 'dialog/update', payload: {result}}
  },

  /**
   * Пользователь нажал "Ок"
   * Самое верхнее диалоговое окно можно скрыть
   */
  ok: () => {
    return {type: 'dialog/ok'}
  },

  /**
   * Пользователь нажал "Отмена"
   * Самое верхнее диалоговое окно можно скрыть
   */
  cancel: () => {
    return {type: 'dialog/cancel'}
  },

  /**
   * Удаление данных самого верхнего диалогового окна
   */
  remove: () => {
    return {type: 'dialog/remove'}
  },
}
