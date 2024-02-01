// Начальное состояние
const initialState = {
  selected: [],
  // Нажата кнопка "Добавить выбранные" или "Отмена"
  result: false,
  // waiting описывает состояние диалогового окна (если оно есть)
  //   true = 'ждём действия пользователя в открытом диалоговом окне',
  //   false = 'ввод пользователя завершен, необходимо обработать данные'
  waiting: false,
}

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'addManyProducts/open':
      return {
        ...initialState, // сбросим стейт
        waiting: true
      };
    case 'addManyProducts/selectItem':
      const isSelected = Boolean(state.selected.find(({ item }) => item._id === action.payload.item._id));
      if (isSelected) {
        return {
          ...state,
          waiting: true,
          // Снять выделение
          selected: state.selected.filter(({ item }) => item._id !== action.payload.item._id)
        }
      } else {
        return {
          ...state,
          waiting: true,
          // Добавить в выделенные
          selected: [...state.selected, {
            item: action.payload.item,
            pcs: action.payload.pcs,
            sum: action.payload.item.price * 1,
          }]
        }
      }
    case 'addManyProducts/deselectItem':
      return {
        ...state,
        waiting: true,
        selected: state.selected.filter(({ item }) => item._id !== action.payload._id)
      };
    case 'addManyProducts/setPcs':
      const element = { ...state.selected.find(({ item }) => item._id === action.payload._id) };
      const array = state.selected.filter(({ item }) => item._id !== action.payload._id);
      element.pcs = action.payload.pcs;
      element.sum = element.item.price * Number(action.payload.pcs)
      array.push(element);
      return {
        ...state,
        selected: array,
        waiting: true,
      };
    case 'addManyProducts/setResult':
      return {
        ...state,
        result: action.payload.result,
        waiting: false,
      };
    default:
      return state;
  }
}

export default reducer;
