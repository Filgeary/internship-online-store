import {ArticleInterface} from "../../../types/ArticleInterface";

interface State {
  data: ArticleInterface,
  waiting: boolean
}

interface Action {
  type: string,
  payload?: {
    data: ArticleInterface
  },
}

// Начальное состояние
export const initialState: State = {
  data: {} as ArticleInterface,
  waiting: false // признак ожидания загрузки
}

// Обработчик действий
function reducer(state: State = initialState, action: any) {
  switch (action.type) {
    case "article/load-start":
      return { ...state, data: {} as ArticleInterface, waiting: true};

    case "article/load-success":
      return { ...state, data: action.payload.data, waiting: false};

    case "article/load-error":
      return { ...state, data: {} as ArticleInterface, waiting: false};

    default:
      return state;
  }
}

export default reducer;
