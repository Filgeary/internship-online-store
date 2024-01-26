// Начальное состояние
const initialState = {
  active: null,
};

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'preBasket/set':
      return {...state, active: action.payload.item};
    case 'preBasket/setCount':
      return {
        ...state,
        active: {
          ...state.active,
          countToAdd: action.payload.count,
        }
      };
    default:
      return state;
  }
}

export default reducer;
