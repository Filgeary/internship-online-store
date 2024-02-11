type TModalsState = {
  activeModals: string[];
  dataObj: Record<string, any>;
};

// Начальное состояние
const initialState: TModalsState = {
  // name: 'countToAdd'
  // name: 'catalogModal',
  activeModals: [], // Стек открытых окон. Именно Стек
  dataObj: {},
};

// Обработчик действий
function reducer(
  state = initialState,
  action: { type: string; payload: { name: string } }
) {
  switch (action.type) {
    case 'modal/open':
      return {
        ...state,
        activeModals: [...state.activeModals, action.payload.name],
        dataObj: {},
      };
    case 'modal/close':
      return {
        ...state,
        activeModals: state.activeModals.slice(0, -1),
        dataObj: action.payload,
      };
    case 'modal/resetDataObj':
      return { ...state, dataObj: null };
    default:
      return state;
  }
}

export default reducer;
