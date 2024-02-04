// Начальное состояние
const initialState = {
  activeModals: [],
  // name: null,
  // title: null,
};

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    // case "modal/open":
    //   return {
    //     ...state,
    //     name: action.payload.name,
    //     title: action.payload.title || null,
    //   };
    case "modal/open":
      console.log(state.activeModals);
      return {
        activeModals: [...state.activeModals, action.payload],
      };
    // case "modal/close":
    //   return { ...state, name: null, title: null };
    case "modal/close":
      // console.log([
      //   state.activeModals.filter((el) => el.name !== action.payload.name),
      // ]);
      return {
        activeModals: [
          ...state.activeModals.filter((el) => el.name !== action.payload.name),
        ],
      };
    default:
      return state;
  }
}

export default reducer;
