import { memo, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector as useSelectorRedux } from 'react-redux';
import Basket from "@src/app/basket";
import DialogLayout from "@src/components/dialog-layout";
import AddProduct from "@src/components/add-product";
import useStore from "@src/hooks/use-store";
import dialogsActions from '@src/store-redux/dialogs/actions';
import shallowequal from "shallowequal";
import TestDialog from "@src/components/test-dialog";

function Windows() {
  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelectorRedux(state => ({
    activeModal: state.modals.name,
    dialogsArray: state.dialogs.dialogs,
    dialogsWaiting: state.dialogs.waiting,
  }), shallowequal);

  const dialogs = select.dialogsArray.length > 0;

  const currentDialog = useMemo(() => (
    select.dialogsArray.slice(-1)[0]
  ), [select.dialogsWaiting, select.dialogsArray])

  const callbacks = {
    // Нажатие "Ок" в диалоговом окне
    onOk: useCallback(() => dispatch(dialogsActions.ok()), [store]),

    // Нажатие "Отмена" в диалоговом окне
    onCancel: useCallback(() => dispatch(dialogsActions.cancel()), [store]),

    // Пользователь вводит цифры `12 шт` в поле
    onChange: useCallback((pcs) => dispatch(dialogsActions.update({ pcs })), [store]),

    // Добавление в корзину
    addToBasket: useCallback(_id => store.actions.basket.addToBasket(_id), [store]),

    // Тестовый диалог
    // TODO: удалить потом
    openTestDialog: useCallback(_id => {
      dispatch(dialogsActions.open({
        name: 'test-dialog',
        title: 'Ещё один диалог',
        _id: '12k1e21kl+++',
        content: {},
      }))
    }, [store]),
  }

  useEffect(() => {
    const dialogNeedsProcessing = !select.dialogsWaiting;

    if (dialogs && dialogNeedsProcessing) {
      const result = currentDialog.result;

      // Обработка данных из диалоговых окон
      switch (currentDialog?.name) {
        case 'add-product':
          const item = currentDialog.content.item;
          // Нажата кнопка "Отмена"
          if (!currentDialog.ok) dispatch(dialogsActions.remove())
          // Нажата кнопка "Ок"
          else {
            // Обработаем результат
            callbacks.addToBasket({ _id: item._id, pcs: Number(result.pcs) });
            // Удалим данные текущего диалогового окна
            dispatch(dialogsActions.remove());
          }
          break;
        // Тестовый диалог
        // TODO: удалить потом
        case 'test-dialog':
          if (!currentDialog.ok) dispatch(dialogsActions.remove())
          break;
      }
    }
  }, [currentDialog])

  // Подсчитаем сумму
  const pcsSumm = currentDialog?.name === 'add-product'
    ? Number(currentDialog.result.pcs ?? 1) * currentDialog.content.item.price
    : 0;

  return (
    <>
      {select.activeModal === 'basket' && <Basket />}

      {dialogs && select.dialogsArray.map((dialog, index) => {
        return (
          <DialogLayout key={dialog._id} title={dialog.title} onClose={callbacks.onCancel} index={index}>
            { /* Добавить в корзину */}
            {dialog.name === 'add-product' && (
              <AddProduct
                onOk={callbacks.onOk}
                onCancel={callbacks.onCancel}
                item={dialog.content.item}
                value={currentDialog.result.pcs}
                updateValue={callbacks.onChange}
                pcsSumm={pcsSumm}
                // Для открытия тестового диалога.
                // TODO:удалить потом
                openTestDialog={callbacks.openTestDialog}
              />
            )}
            { /* Тестовый диалог. TODO: удалить потом */}
            {dialog.name === 'test-dialog' && (
              <TestDialog onCancel={callbacks.onCancel} />
            )}
          </DialogLayout>
        )
      })}
    </>
  );
}

export default memo(Windows);
