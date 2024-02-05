import { memo, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector as useSelectorRedux } from 'react-redux';
import DialogLayout from "@src/components/dialog-layout";
import useStore from "@src/hooks/use-store";
import dialogsActions from '@src/store-redux/dialogs/actions';
import addProductActions from '@src/store-redux/add-product/actions';
import shallowequal from "shallowequal";
import AddProductCard from "@src/components/add-product-card";
import modalsActions from '@src/store-redux/modals/actions';

function AddProduct(props) {
  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelectorRedux(state => ({
    item: state.addProduct.item,
    pcs: state.addProduct.pcs,
    sum: state.addProduct.sum,
    result: state.addProduct.result,
    waiting: state.addProduct.waiting,
    dialogsArray: state.dialogs.dialogs,
  }), shallowequal);

  const callbacks = {
    // Нажатие "Ок" в диалоговом окне
    onOk: useCallback(() => dispatch(addProductActions.setResult(true)), [store]),
    // Нажатие "Отмена" в диалоговом окне
    onCancel: useCallback(() => dispatch(addProductActions.setResult(false)), [store]),
    // При переходе по ссылке товара в диалоговом окне на другую страницу,
    // закроем все диалоговые окна и модалку
    onCloseAll: useCallback(() => {
      dispatch(dialogsActions.closeAll()) // все диалоговые окна
      dispatch(modalsActions.close());    // модалка
    }, [store]),
    // Пользователь вводит цифры `12 шт` в поле
    onChange: useCallback((pcs) => dispatch(addProductActions.setPcs(pcs)), [store]),
  }

  const context = useMemo(() => ({
    title: (() => {
      switch (props.context) {
        case 'add-to-basket'  : return 'Добавить в корзину';
        case 'add-to-selected': return 'Дополнительные опции товара';
        default: return '';
      }
    })(),
  }), [props.context])

  useEffect(() => {
    if (!select.waiting) {
      // Закроем окно, если результат получен
      dispatch(dialogsActions.close());

      // Если нажата кнопка "Ок" обработаем результат
      if (select.result) select.dialogsArray.find(({ name }) => name === props.context)
        .ok({ _id: select.item._id, pcs: Number(select.pcs) });
    }

    // Если диалоговое окно было закрыто не кнопками, а кем-то ещё, например
    // при закрытии всех окон при переходе на другую страницу,
    // то сделаем вид, что была нажата кнопка "Отмена".
    // Это важно, например, для кнопки в каталоге, которая отображает спиннер, пока
    // диалоговое окно открыто.
    return () => callbacks.onCancel()
  }, [select.waiting])

  return (
    <DialogLayout title={context.title} onClose={callbacks.onCancel} indent={props.indent}>
      <AddProductCard
        onOk={callbacks.onOk}
        onCancel={callbacks.onCancel}
        onCloseAll={callbacks.onCloseAll}
        item={select.item}
        value={select.pcs}
        updateValue={callbacks.onChange}
        pcsSumm={select.sum}
      />
    </DialogLayout>
  );
}

export default memo(AddProduct);
