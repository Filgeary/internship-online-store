// Начальное состояние
const initialState = {
  name: '',
  activeModal: false
}

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'modal/open':
      return {...state, name: action.payload.name};
    case 'modal/close':
      return {...state, name: null, activeModal: false};
    case 'modal/active': 
      return {...state, activeModal: action.payload.status}
    default:
      return state;
  }
}

export default reducer;
