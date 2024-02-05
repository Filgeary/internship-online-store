/*
Допущения:
 - Модальное окно может быть только одно, в нём можно реализовать смену контента, если нужно несколько модалок
 - Диалоговых окон может быть много
 - Диалоговые окна отображаются всегда выше модальных
 - Модальное окно и диалоговые окна могут вызывать новые диалоговые окна
 - Диалоговое окно не должно вызывать модальное окно
 - Диалоговые окна блокируют экран под собой, так же как и модальное окно (но без затенения),
   поэтому они будут закрыты в том же порядке, что и были открыты (но с конца естественно).
   Порядок важен для диалоговых окон, которые вызвали новые диалоговые окна и ждут их результат.
 - При клике на блокирующую подложку диалогового окна, оно закрывается как если бы была
   нажата кнопка "Отмена". В будущем, можно сделать опцию "Важное диалоговое окно", и такое
   окно будет закрываться исключительно по клику на одну из кнопок.
*/

// Начальное состояние
const initialState = {
  dialogs: [],
}

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'dialog/open':
      const newDialog = {
        name: action.payload.name,
        _id: action.payload._id,
        ok: action.payload.ok,
      }
      return {
        ...state,
        // Добавляем новое диалоговое окно
        dialogs: [...state.dialogs, newDialog],
      };
    case 'dialog/close':
      let result = [...state.dialogs];
      // Удаляем верхнее диалоговое окно
      if (!action.payload) result = state.dialogs.slice(0, -1)
      // Удаляем все переданные окна // TODO: не оптимальное решение, много обходов лишних, подумать
      else for (const idToRemove of action.payload)
        result = result.filter(({ _id }) => _id !== idToRemove);
      return {
        ...state,
        dialogs: result,
      };
    case 'dialog/closeAll':
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

export default reducer;
