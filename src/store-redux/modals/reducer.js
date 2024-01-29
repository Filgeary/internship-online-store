// Начальное состояние
const initialState = {
  name: '',
  data: {}
}

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'modal/open':
      return {...state, name: action.payload.name, data: action.payload.data};
    case 'modal/close':
      return {...state, name: null, data: {}};
    default:
      return state;
  }
}

export default reducer;
