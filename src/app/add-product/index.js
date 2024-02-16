import { memo, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector as useSelectorRedux } from 'react-redux';
import DialogLayout from "@src/components/dialog-layout";
import useStore from "@src/hooks/use-store";
import dialogsActions from '@src/store-redux/dialogs/actions';
import addProductActions from '@src/store-redux/add-product/actions';
import shallowequal from "shallowequal";
import AddProductCard from "@src/components/add-product-card";
import modalsActions from '@src/store-redux/modals/actions';
import useDialog from "@src/hooks/use-dialog";
import { EContext } from "@custom-types/context";

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
        case EContext.addToBasket: return 'Добавить в корзину';
        case EContext.addToSelected: return 'Дополнительные опции товара';
        default: return '';
      }
    })(),
  }), [props.context])

  useDialog({
    dialogName: props.context,
    waitingResult: select.waiting,
    OkOrCancell: select.result,
    result: { _id: select.item._id, pcs: Number(select.pcs) },
    onCancel: callbacks.onCancel,
  })

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
