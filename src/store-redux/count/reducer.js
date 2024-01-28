// Начальное состояние
const initialState = {
  activeItem: null,
};

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case "count/setActive":
      return { ...state, activeItem: {...state.activeItem, ...action.payload.item} };
    case "count/setCount":
      return { ...state, activeItem: {...state.activeItem, count: action.payload.count} };
    case "count/reset":
      return { ...state, activeItem: null };
    default:
      return state;
  }
}

export default reducer;
