import {memo, useCallback, useMemo} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import dialogsActions from '@src/store-redux/dialogs/actions';
import { useDispatch, useSelector as useSelectorRedux } from 'react-redux';
import shallowEqual from "shallowequal";

function CatalogList() {
  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelector(state => ({
    list: state.catalog.list,
    page: state.catalog.params.page,
    limit: state.catalog.params.limit,
    count: state.catalog.count,
    waiting: state.catalog.waiting,
  }));

  const selectRedux = useSelectorRedux(state => ({
    dialogsArray: state.dialogs.dialogs,
  }), shallowEqual);

  const callbacks = {
    // Открытие диалогового окна для добавления в корзину
    addToBasketDialog: useCallback(item => (
      dispatch(dialogsActions.open({
        name: 'add-product',
        title: 'Добавить в корзину',
        _id: item._id,
        content: { item },
        result: { pcs: '1' }
      }))
    ), [store]),
    // Добавление в корзину
    // addToBasket: useCallback(_id => store.actions.basket.addToBasket(_id), [store]),
    // Пагинация
    onPaginate: useCallback(page => store.actions.catalog.setParams({page}), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({page, limit: select.limit, sort: select.sort, query: select.query})}`;
    }, [select.limit, select.sort, select.query])
  }

  // Нужно для отображения лоадера на кликнутой кнопке "Добавить"
  const clickedItem = useMemo(() => (
    selectRedux.dialogsArray.find((dialog) => (
      dialog.name === 'add-product'
    ))?.content?.item?._id
  ), [selectRedux.dialogsArray])

  const {t} = useTranslate();

  const renders = {
    item: useCallback(item => (
      <Item item={item}
        onAdd={callbacks.addToBasketDialog}
        clickedItem={clickedItem}
        link={`/articles/${item._id}`}
        labelAdd={t('article.add')}
      />
    ), [callbacks.addToBasketDialog, selectRedux.dialogsArray, t]),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.page} limit={select.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

export default memo(CatalogList);
