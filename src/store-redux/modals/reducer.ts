// Начальное состояние
export type TReducer = {
  list: string[];
  catalog: boolean;
  data: any;
};
const initialState: TReducer = {
  list: [],
  catalog: false,
  data: null,
};

// Обработчик действий
function reducer(
  state = initialState,
  action: { type: any; payload: { name: string; data: any } }
) {
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
        data: action.payload.data,
      };
    case "modal/reset":
      return { ...state, data: null };
    default:
      return state;
  }
}

export default reducer;
