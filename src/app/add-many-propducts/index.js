import {memo, useCallback, useEffect} from "react";
import DialogLayout from "@src/components/dialog-layout";
import AddManyProductsCard from "@src/components/add-many-products-card";
import CatalogFilter from "@src/containers/catalog-filter";
import CatalogList from "@src/containers/catalog-list";
import { useMemo } from "react";
import dialogsActions from '@src/store-redux/dialogs/actions';
import { useDispatch, useSelector as useSelectorRedux } from 'react-redux';
import useStore from "@src/hooks/use-store";
import addManyProductsActions from '@src/store-redux/add-many-products/actions';
import shallowequal from "shallowequal";

function AddManyProducts(props) {
  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelectorRedux(state => ({
    selected: state.addManyProducts.selected,
    result: state.addManyProducts.result,
    waiting: state.addManyProducts.waiting,
  }), shallowequal);

  const callbacks = {
    // нажата "Отмена"
    onCancel: useCallback(() => dispatch(addManyProductsActions.setResult(false)), [store]),

    // нажата "Добавить выбранные"
    onAddAll: useCallback(() => dispatch(addManyProductsActions.setResult(true)), [store]),

    // Массовое добавление в корзину
    addAllToBasket: useCallback((selected) => {
      selected.map(({ item, pcs }) => {
        store.actions.basket.addToBasket(item._id, pcs)
      })
    }, [store]),
  }

  const context = useMemo(() => ({
    title: (() => {
      switch (props.context) {
        default: return 'Выберите товары';
      }
    })(),
    okProcessing: (() => {
      switch (props.context) {
        case 'add-more-to-basket': return () => callbacks.addAllToBasket(select.selected);
        default: return () => {};
      }
    })(),
  }), [props.context, select.selected, store])

  useEffect(() => {
    if (!select.waiting) {
      // Закроем окно, если результат получен
      dispatch(dialogsActions.close());

      // Если нажата кнопка "Ок" обработаем результат
      if (select.result) context.okProcessing();
    }
  }, [select.waiting])

  return (
    <DialogLayout title={context.title} onClose={callbacks.onCancel} indent={props.indent} theme={props.theme}>
      <AddManyProductsCard onCancel={callbacks.onCancel} onAddAll={callbacks.onAddAll}>
        <CatalogFilter/>
        <CatalogList context={props.context} />
      </AddManyProductsCard>
    </DialogLayout>
  );
}

export default memo(AddManyProducts);
