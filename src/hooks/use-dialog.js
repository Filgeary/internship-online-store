import { useEffect } from 'react';
import dialogsActions from '@src/store-redux/dialogs/actions';
import { useDispatch, useSelector as useSelectorRedux } from 'react-redux';
import shallowequal from "shallowequal";

/**
 * Хук обрабатывающий результат модального окна
 * @param {Object}
 * @returns {Boolean}
 */
export default function useDialog({ dialogName, waitingResult, OkOrCancell, result, onCancel }) {
  const dispatch = useDispatch();

  const select = useSelectorRedux(state => ({
    dialogsArray: state.dialogs.dialogs,
  }), shallowequal);

  useEffect(() => {
    // Компонент диалогового окна должен сообщить, когда можно начать обработку результата,
    // то есть когда ожидание действия пользователя завершено:
    //   waitingResult = true - результата ещё нет (или промежуточный результат)
    //   waitingResult = false - результат можно считать финальным и начать обработку
    if (!waitingResult) {
      // Закроем окно, так как результат получен
      dispatch(dialogsActions.close());

      // Если нажата кнопка "Ок" обработаем результат
      //   resultOption = true - кнопка "Ок"
      //   resultOption = false - кнопка "Отмена"
      if (OkOrCancell) select.dialogsArray.find(({ name }) => name === dialogName)
        .ok(result);
    }

    // Если диалоговое окно было закрыто не кнопками, а кем-то ещё, например
    // при закрытии всех окон при переходе на другую страницу,
    // то сделаем вид, что была нажата кнопка "Отмена".
    // Это важно, например, для кнопки в каталоге, которая отображает спиннер, пока
    // диалоговое окно открыто.
    return () => onCancel()
  }, [waitingResult])
}
