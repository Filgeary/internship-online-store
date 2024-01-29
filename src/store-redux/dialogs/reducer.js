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

Напоминания:
 - Вызвающей стороне важно не забыть вызвать экшн .remove() чтобы удалить данные
   закрываемого диалогового окна, после того как они будут получены и обработаны.
 - content передаваемый в .open() должен содержать поле _id с уникальным ключем.
 - Поле ok объекта диалога позволяет узнать, была ли нажата кнопка "Ок" или "Отмена"
*/

// Начальное состояние
const initialState = {
  // waiting описывает состояние самого верхнего диалогового окна (если оно есть)
  //   true = 'ждём действия пользователя в открытом диалоговом окне',
  //   false = 'ввод пользователя завершен, необходимо обработать данные'
  waiting: false,
  dialogs: [],
}

// Обработчик действий
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'dialog/open':
      return {
        ...state,
        waiting: true,
        // Добавляем новое диалоговое окно
        dialogs: [...state.dialogs, {
          name: action.payload.name,
          title: action.payload.title,
          _id: action.payload._id,
          content: action.payload.content,
          result: action.payload.result,
        }]
      };
    case 'dialog/update': // Пользователь изменил содержимое, например текст в поле в диалоговом окне
      const dialogsArray = [...state.dialogs];
      const lastItem = { ...dialogsArray.pop() };
      lastItem.result = action.payload.result;
      dialogsArray.push(lastItem);
      return {
        ...state,
        dialogs: dialogsArray,
      };
    case 'dialog/ok':
      const dialogs = [...state.dialogs];
      const last = { ...dialogs.pop() };
      last.ok = true;
      dialogs.push(last);
      return {
        ...state,
        // Пользователь нажал кнопку "Ок"
        // теперь верхнее диалоговое окно можно скрыть и ждать вызова 'dialog/remove'
        waiting: false,
        dialogs,
      };
    case 'dialog/cancel':
      const dialogsAll = [...state.dialogs];
      const lastDialog = { ...dialogsAll.pop() };
      lastDialog.ok = false;
      dialogsAll.push(lastDialog);
      return {
        ...state,
        // Пользователь нажал кнопку "Отмена"
        // теперь верхнее диалоговое окно можно скрыть и ждать вызова 'dialog/remove'
        waiting: false,
        dialogs: dialogsAll,
      };
    case 'dialog/remove':
      // Вызвающая сторона забрала результат и вызвала 'dialog/remove'.
      // Удаляем верхнее диалоговое окно с его данными
      const updatedDialogsArray = state.dialogs.slice(0, -1);
      // Ожидаем следущее окно, если оно есть
      const updatedWaiting = updatedDialogsArray.length !== 0;
      return {
        ...state,
        dialogs: updatedDialogsArray,
        waiting: updatedWaiting,
      };
    default:
      return state;
  }
}

export default reducer;
