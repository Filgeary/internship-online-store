// Начальное состояние
const initialState = {
  // name: 'countToAdd'
  name: '',
}

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'modal/open':
      return {...state, name: action.payload.name};
    case 'modal/close':
      return {...state, name: null};
    default:
      return state;
  }
}

export default reducer;
