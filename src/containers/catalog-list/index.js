import {memo, useCallback, useMemo} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import dialogsActions from '@src/store-redux/dialogs/actions';
import addToBasketActions from '@src/store-redux/add-to-basket/actions';
import { useDispatch, useSelector as useSelectorRedux } from 'react-redux';
import shallowEqual from "shallowequal";
import ItemManyProducts from "@src/components/item-many-products";
import addManyProductsActions from '@src/store-redux/add-many-products/actions';

function CatalogList(props) {
  const store = useStore();
  const dispatch = useDispatch();
  const {t} = useTranslate();

  const context = {
    // Контекст для диалоговых окон
    dialogContext: useMemo(() => {
      switch (props.context) {
        case 'add-more-to-basket': return 'add-to-selected';
        default: return 'add-to-basket';
      }
    }, [props.context]),
  }

  const select = useSelector(state => ({
    list: state.catalog.list,
    page: state.catalog.params.page,
    limit: state.catalog.params.limit,
    count: state.catalog.count,
    waiting: state.catalog.waiting,
  }));

  const selectRedux = useSelectorRedux(state => ({
    addToBasketWaiting: state.addToBasket.waiting,
    item: state.addToBasket.item,
    selectedProducts: state.addManyProducts.selected,
  }), shallowEqual);

  const callbacks = {
    // Открытие диалогового окна выбора количества для добавления в корзину или для списка выделенных товаров
    addToBasketDialog: useCallback((item, pcs = 1) => {
      dispatch(dialogsActions.open(context.dialogContext)); // Открываем диалоговое окно
      dispatch(addToBasketActions.setData(item));           // Отправляем ему данные // TODO: переименовать в сторе в `add-product`
      dispatch(addToBasketActions.setPcs(pcs));             // Устанавливаем начальное значение количества в открывающемся диалоговом окне
    }, [store, context.dialogContext]),
    // Выделение товара в списке или снятие выделения
    selectProduct: useCallback(item => {
      dispatch(addManyProductsActions.selectItem(item));
    }, [store]),
    // Пагинация
    onPaginate: useCallback(page => store.actions.catalog.setParams({ page }), [store]),
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
        clickedItem={selectRedux.addToBasketWaiting ? selectRedux.item?._id : ''}
        link={`/articles/${item._id}`}
        labelAdd={t('article.add')}
      />
    ), [callbacks.addToBasketDialog, selectRedux.addToBasketWaiting, t]),
    // Для окна выбора нескольких товаров
    itemManyProducts: useCallback(item => (
      <ItemManyProducts item={item}
        onEdit={callbacks.addToBasketDialog}
        onSelectProduct={callbacks.selectProduct}
        // нужно для спиннера на кнопке, пока открыто диалоговое окно
        clickedItem={selectRedux.addToBasketWaiting ? selectRedux.item?._id : ''}
        labelEdit='Изменить'
        selectedItems={selectRedux.selectedProducts}
      />
    ), [callbacks.addToBasketDialog, selectRedux.addToBasketWaiting, selectRedux.selectedProducts, t]),
  };

  // Контекст для рендеров
  context.renderItem = useMemo(() => {
    switch (props.context) {
      case 'add-more-to-basket' : return renders.itemManyProducts;
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
