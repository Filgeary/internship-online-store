
// Начальное состояние
const initialState = {
  modals: [],
  activeModal: false,
  statusCatalogModal: null
}

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'modal/open':
      // return {...state, name: [...state.name, action.payload.name], id: [...state.id, action.payload.id]};
      return {...state, modals: [...state.modals, action.payload]};
    case 'modal/close':
      return {...state, modals: action.payload.modals};
    case 'modal/active': 
      return {...state, activeModal: action.payload.status}
    case 'modal/status/catalog': 
      return {...state, statusCatalogModal: action.payload.status}
    default:
      return state;
  }
}

export default reducer;
