// Начальное состояние
const initialState = {
  item: {},
  pcs: '1',
  sum: 0,
  // Нажата кнопка "Ок" или "Отмена"
  result: false,
  // waiting описывает состояние диалогового окна (если оно есть)
  //   true = 'ждём действия пользователя в открытом диалоговом окне',
  //   false = 'ввод пользователя завершен, необходимо обработать данные'
  waiting: false,
}

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'addProduct/setData':
      return {
        ...initialState,
        item: action.payload.item,
        sum: action.payload.item.price * 1,
        waiting: true,
      };
    case 'addProduct/setPcs':
      return {
        ...state,
        pcs: String(action.payload.pcs),
        sum: state.item.price * Number(action.payload.pcs),
      };
    case 'addProduct/setResult':
      return {
        ...state,
        result: action.payload.result,
        waiting: false,
      };
    default:
      return state;
  }
}

export default reducer;
