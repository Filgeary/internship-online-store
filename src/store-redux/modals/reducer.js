// Начальное состояние
const initialState = {
  name: [],
  activeModal: false,
  statusCatalogModal: null
}

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'modal/open':
      return {...state, name: [...state.name, action.payload.name]};
    case 'modal/close':
      return {...state, name: action.payload.names};
    case 'modal/active': 
      return {...state, activeModal: action.payload.status}
    case 'modal/status/catalog': 
      return {...state, statusCatalogModal: action.payload.status}
    default:
      return state;
  }
}

export default reducer;
