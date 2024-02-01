import { memo, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector as useSelectorRedux } from 'react-redux';
import DialogLayout from "@src/components/dialog-layout";
import useStore from "@src/hooks/use-store";
import dialogsActions from '@src/store-redux/dialogs/actions';
import addToBasketActions from '@src/store-redux/add-to-basket/actions';
import shallowequal from "shallowequal";
import AddToBasketCard from "@src/components/add-to-basket-card";
import addManyProductsActions from '@src/store-redux/add-many-products/actions';

function AddProduct(props) {
  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelectorRedux(state => ({
    item: state.addToBasket.item,
    pcs: state.addToBasket.pcs,
    sum: state.addToBasket.sum,
    result: state.addToBasket.result,
    waiting: state.addToBasket.waiting,
  }), shallowequal);

  const callbacks = {
    // Нажатие "Ок" в диалоговом окне
    onOk: () => dispatch(addToBasketActions.setResult(true)),

    // Нажатие "Отмена" в диалоговом окне
    onCancel: () => dispatch(addToBasketActions.setResult(false)),

    // Пользователь вводит цифры `12 шт` в поле
    onChange: useCallback((pcs) => dispatch(addToBasketActions.setPcs(pcs)), [store]),

    // Добавление в корзину
    addToBasket: useCallback((_id, pcs) => store.actions.basket.addToBasket(_id, pcs), [store]),

    // Изменение количества итемов в список на добавление в корзину
    setPcs: useCallback((_id, pcs) => dispatch(addManyProductsActions.setPcs(_id, pcs)), [store]),
  }

  const context = useMemo(() => ({
    title: (() => {
      switch (props.context) {
        case 'add-to-basket'  : return 'Добавить в корзину';
        case 'add-to-selected': return 'Выберите количество';
        default: return '';
      }
    })(),
    okProcessing: (() => {
      switch (props.context) {
        case 'add-to-basket': return () => callbacks.addToBasket(select.item._id, Number(select.pcs));
        case 'add-to-selected': return () => callbacks.setPcs(select.item._id, Number(select.pcs));
        default: return () => {};
      }
    })(),
  }), [props.context, select.pcs])

  useEffect(() => {
    if (!select.waiting) {
      // Закроем окно, если результат получен
      dispatch(dialogsActions.close());

      // Если нажата кнопка "Ок" обработаем результат
      if (select.result) context.okProcessing();
    }
  }, [select.waiting])

  return (
    <DialogLayout title={context.title} onClose={callbacks.onCancel} indent={props.indent}>
      <AddToBasketCard
        onOk={callbacks.onOk}
        onCancel={callbacks.onCancel}
        item={select.item}
        value={select.pcs}
        updateValue={callbacks.onChange}
        pcsSumm={select.sum}
      />
    </DialogLayout>
  );
}

export default memo(AddProduct);
