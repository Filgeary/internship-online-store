// Начальное состояние
const initialState = {
  list: [],
  catalog: false,
};

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case "modal/open":
      return {
        ...state,
        list: [...state.list, action.payload.name],
        catalog: action.payload.name === "catalog" && true,
      };
      
    case "modal/close":
      return {
        ...state,
        list: state.list.filter((el) => el !== action.payload.name),
        catalog: action.payload.name === "catalog" && false,
      };
    default:
      return state;
  }
}

export default reducer;
