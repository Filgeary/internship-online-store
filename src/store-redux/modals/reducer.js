// Начальное состояние
const initialState = {
  name: '',
  result: {}
}

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'modal/open':
      return {...state, name: action.payload.name, result: {}};
      case 'modal/close':
        if (state.name) {
          return {...state, name: null, result: {[state.name]: action.payload.result}};
        }
        return {...state, name: null, result: {}}
      case 'modal/reset-result':
        return {...state, result: {}};
    default:
      return state;
  }
}

export default reducer;
