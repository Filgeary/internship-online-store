// Начальное состояние
const initialState = {
  // name: 'countToAdd'
  name: '',
  dataObj: {},
}

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'modal/open':
      return {...state, name: action.payload.name, dataObj: {}};
    case 'modal/close':
      return {...state, name: null, dataObj: action.payload.dataObj};
    default:
      return state;
  }
}

export default reducer;
