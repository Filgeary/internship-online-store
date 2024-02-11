import { IModal } from "./types";

interface IModalState {
  activeModals: IModal[];
}

// Начальное состояние
const initialState: IModalState = {
  activeModals: [],
};

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case "modal/open":
      return {
        activeModals: [...state.activeModals, action.payload],
      };

    case "modal/close":
      return {
        activeModals: [
          ...state.activeModals.filter((el) => el.id !== action.payload.id),
        ],
      };
    default:
      return state;
  }
}

export default reducer;
