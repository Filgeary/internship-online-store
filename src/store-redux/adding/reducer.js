// Начальное состояние добавления товара
const initialState = {
  id: null,
  count: 0,
  isAdd: false,
}

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'adding/open':
      return {...state, id: action.payload.id, count: 1, isAdd: false};
    case 'adding/set':
      return {...state, count: action.payload.count, isAdd: true};
    case 'adding/close':
      return {...state, id: null, count: 0, isAdd: false};
    default:
      return state;
  }
}

export default reducer;
