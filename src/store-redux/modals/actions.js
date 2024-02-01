export default {
  /**
   * Открытие модалки по названию
   * @param name
   */
  open: (name) => {
    return {type: 'modal/open', payload: {name}};
  },

  // /**
  //  * Закрытие модалки
  //  * @param name
  //  */
  // close: (names) => {
  //   return {type: 'modal/close', payload: {names}}
  // },

/**
 * Статус открытости всех модальных окон
 * @param status
 */
  changeActiveModal: (status) => {
    return {type: 'modal/active', payload: {status}}
  },

  /**
   * Закрытие модалки
   * @param name  
   */
  closeModal: (name) => (dispatch, getState, services) => {
    const newNames = getState().modals.name.filter((item) => item !== name)
    dispatch({type: 'modal/close', payload: {names: newNames}})
    if(getState().modals.name.length < 1) getState().modals.activeModal = false
  },

  /**
 * Статус открытости модального окна с каталогом товара
 * @param status
 */
  changeStatusCatalogModal: (status) => {
    return {type: 'modal/status/catalog', payload: {status}}
  },
}
