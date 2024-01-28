// Начальное состояние
const initialState = {
  _id: null,
  count: null
};

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case "count/setActive":
      return { ...state, _id: action.payload._id};
    case "count/setCount":
      return { ...state, count: action.payload.count };
    case "count/reset":
      return { ...state, _id: null, count: null };
    default:
      return state;
  }
}

export default reducer;
