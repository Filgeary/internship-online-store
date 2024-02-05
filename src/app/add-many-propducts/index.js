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
import useInit from "@src/hooks/use-init";

function AddManyProducts(props) {
  const store = useStore();
  const dispatch = useDispatch();

  // Загрузим каталог и категории для диалогового окна
  useInit(async () => {
    await Promise.all([
      store.actions[props.context].initParams(),
      store.actions.categories.load(),
    ]);
  }, [props.context])

  const select = useSelectorRedux(state => ({
    selected: state.addManyProducts.selected,
    result: state.addManyProducts.result,
    waiting: state.addManyProducts.waiting,
    dialogsArray: state.dialogs.dialogs,
  }), shallowequal);

  const callbacks = {
    // нажата "Отмена"
    onCancel: useCallback(() => dispatch(addManyProductsActions.setResult(false)), [store]),
    // нажата "Добавить выбранные"
    onAddAll: useCallback(() => dispatch(addManyProductsActions.setResult(true)), [store]),
  }

  const context = useMemo(() => ({
    title: (() => {
      switch (props.context) {
        default: return 'Выберите товары';
      }
    })(),
  }), [props.context])

  useEffect(() => {
    if (!select.waiting) {
      // Закроем окно, если результат получен
      dispatch(dialogsActions.close());

      // Если нажата кнопка "Ок" обработаем результат
      if (select.result) select.dialogsArray.find(({ name }) => name === props.context)
        .ok(select.selected);
    }

    // Если диалоговое окно было закрыто не кнопками, а кем-то ещё, например
    // при закрытии всех окон при переходе на другую страницу,
    // то сделаем вид, что была нажата кнопка "Отмена".
    // Это важно, например, для кнопки в каталоге, которая отображает спиннер, пока
    // диалоговое окно открыто.
    return () => callbacks.onCancel()
  }, [select.waiting])


  // Хотя бы один итем с ненулевым (пустая строка в поле шт) количеством штук
  const isSome = useMemo(() => Boolean(select.selected.find(({ pcs }) => pcs > 0)), [select.selected]);

  return (
    <DialogLayout title={context.title} onClose={callbacks.onCancel} indent={props.indent} theme={props.theme}>
      <AddManyProductsCard onCancel={callbacks.onCancel} onAddAll={callbacks.onAddAll} buttonActive={isSome}>
        <CatalogFilter context={props.context} />
        <CatalogList context={props.context} />
      </AddManyProductsCard>
    </DialogLayout>
  );
}

export default memo(AddManyProducts);
