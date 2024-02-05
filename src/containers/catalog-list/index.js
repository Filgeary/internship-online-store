import {memo, useCallback, useMemo} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import dialogsActions from '@src/store-redux/dialogs/actions';
import addProductActions from '@src/store-redux/add-product/actions';
import { useDispatch, useSelector as useSelectorRedux } from 'react-redux';
import shallowEqual from "shallowequal";
import ItemManyProducts from "@src/components/item-many-products";
import addManyProductsActions from '@src/store-redux/add-many-products/actions';

function CatalogList(props) {
  const store = useStore();
  const dispatch = useDispatch();
  const {t} = useTranslate();

  const context = {
    // Форк или оригинал
    name: props.context ?? 'catalog',
    // Контекст для диалоговых окон
    dialogContext: useMemo(() => {
      switch (props.context) {
        case 'add-more-to-basket': return 'add-to-selected';
        default: return 'add-to-basket';
      }
    }, [props.context]),
  }

  const select = useSelector(state => ({
    list: state[context.name].list,
    page: state[context.name].params.page,
    limit: state[context.name].params.limit,
    count: state[context.name].count,
    waiting: state[context.name].waiting,
  }));

  const selectRedux = useSelectorRedux(state => ({
    addProductWaiting: state.addProduct.waiting,
    item: state.addProduct.item,
    selectedProducts: state.addManyProducts.selected,
  }), shallowEqual);

  const callbacks = {
    // Открытие диалогового окна выбора количества для добавления в корзину
    addToBasketDialog: useCallback((item, pcs = 1) => {
      // Открываем диалоговое окно и передаём ему колбэк на случай успеха
      dispatch(dialogsActions.open(context.dialogContext, result => {
        // Обработка в случае успеха (добавим в корзину)
        store.actions.basket.addToBasket(result);
      }));
      dispatch(addProductActions.setData(item)); // Отправляем данные для диалогового окна
      dispatch(addProductActions.setPcs(pcs));   // Устанавливаем начальное значение количества
    }, [store, context.dialogContext]),
    // Открытие диалогового окна выбора количества для списка выделенных товаров
    onEdit: useCallback((item, pcs = 1) => {
      // Открываем диалоговое окно и передаём ему колбэк на случай успеха
      dispatch(dialogsActions.open(context.dialogContext, result => {
        // Обработка в случае успеха (установим новое количество штук)
        dispatch(addManyProductsActions.setPcs(result._id, result.pcs))
      }));
      dispatch(addProductActions.setData(item)); // Отправляем данные для диалогового окна
      dispatch(addProductActions.setPcs(pcs));   // Устанавливаем начальное значение количества
    }, [store, context.dialogContext]),
    // Пользователь вводит цифры `12 шт` в поле
    onChangePcs: useCallback((_id, pcs) => dispatch(addManyProductsActions.setPcs(_id, pcs)), [store]),
    // Выделение товара в списке или снятие выделения
    selectProduct: useCallback(item => dispatch(addManyProductsActions.selectItem(item)), [store]),
    // Пагинация
    onPaginate: useCallback(page => store.actions[context.name].setParams({ page }), [store, context.name]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({ page, limit: select.limit, sort: select.sort, query: select.query })}`;
    }, [select.limit, select.sort, select.query])
  }

  const renders = {
    // Для главной страницы
    item: useCallback(item => (
      <Item item={item}
        onAdd={callbacks.addToBasketDialog}
        // нужно для спиннера на кнопке, пока открыто диалоговое окно
        clickedItem={selectRedux.addProductWaiting ? selectRedux.item?._id : ''}
        link={`/articles/${item._id}`}
        labelAdd={t('article.add')}
      />
    ), [callbacks.addToBasketDialog, selectRedux.addProductWaiting, t]),
    // Для окна выбора нескольких товаров
    itemManyProducts: useCallback(item => (
      <ItemManyProducts item={item}
        onEdit={callbacks.onEdit}
        onChangePcs={callbacks.onChangePcs}
        onSelectProduct={callbacks.selectProduct}
        // нужно для спиннера на кнопке, пока открыто диалоговое окно
        clickedItem={selectRedux.addProductWaiting ? selectRedux.item?._id : ''}
        labelEdit='Настроить'
        selectedItems={selectRedux.selectedProducts}
      />
    ), [callbacks.addToBasketDialog, selectRedux.addProductWaiting, selectRedux.selectedProducts, t]),
  };

  // Контекст для рендеров
  context.renderItem = useMemo(() => {
    switch (props.context) {
      case 'add-more-to-basket': return renders.itemManyProducts;
      default: return renders.item;
    }
  }, [props.context, renders])

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={context.renderItem}/>
      <Pagination count={select.count} page={select.page} limit={select.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

export default memo(CatalogList);
