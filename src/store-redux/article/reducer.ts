import { Article } from "@src/store/article/types";

export interface IArticleState {
  data: Article;
  waiting: boolean;
}

// Начальное состояние
export const initialState: IArticleState = {
  data: {} as Article,
  waiting: false, // признак ожидания загрузки
};

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case "article/load-start":
      return { ...state, data: {}, waiting: true };

    case "article/load-success":
      return { ...state, data: action.payload.data, waiting: false };

    case "article/load-error":
      return { ...state, data: {}, waiting: false }; //@todo текст ошибки сохранить?

    default:
      // Нет изменений
      return state;
  }
}

export default reducer;
