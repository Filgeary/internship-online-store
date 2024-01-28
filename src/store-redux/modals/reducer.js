// Начальное состояние
const initialState = {
  name: null,
  title: null,
};

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case "modal/open":
      return {
        ...state,
        name: action.payload.name,
        title: action.payload.title || null,
      };
    case "modal/close":
      return { ...state, name: null, title: null };
    default:
      return state;
  }
}

export default reducer;
