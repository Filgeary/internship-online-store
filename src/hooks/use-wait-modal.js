import { useEffect } from 'react';
import modalsActions from '@src/store-redux/modals/actions';
import { useDispatch, useSelector } from 'react-redux';


/**
 * @deprecated
 * Хук для отслеживаний результатов модалок. 
 * Автоматически очищает результат модалки после выполнения пользовательской функции onResultFunc(result).
 * Возвращает результат если он не равен undefined
 * @param modalName {String} Название модалки для показа
 * @param onResultFunc {Function} Пользовательская функция для обратоки значения result
 * @param depends {Array} Значения при смене которых callback снова исполнится.
 */
export default function useWaitModal(modalName, onResultFunc, depends = []) {

  const resultModal = useSelector((state) => state.modals.result[modalName]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (resultModal === undefined) {
        return;
    }
    onResultFunc(resultModal);
    dispatch(modalsActions.resetModalResult());
  }, [resultModal, dispatch, ...depends]);
}
