export default {
  /**
   * Открытие модалки по названию
   * @param name
   *  @param id
   */
  open: ({name, id}) => {
    return {type: 'modal/open', payload: {name, id}};
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
  closeModal: (id) => (dispatch, getState, services) => {
    const newModals = getState().modals.modals.filter((item) => item.id !== id)
    dispatch({type: 'modal/close', payload: {modals: newModals}})
    if(getState().modals.modals.length < 1) getState().modals.activeModal = false
  },

  /**
 * Статус открытости модального окна с каталогом товара
 * @param status
 */
  changeStatusCatalogModal: (status) => {
    return {type: 'modal/status/catalog', payload: {status}}
  },
}
