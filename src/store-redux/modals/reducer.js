// Начальное состояние
const initialState = {
  list:[]
}

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'modal/open':
      return {...state, list:[...state.list, action.payload.name]};
    case 'modal/close':
      return {...state, list: state.list.filter((el) => el !== action.payload.name),};
    default:
      return state;
  }
}

export default reducer;
