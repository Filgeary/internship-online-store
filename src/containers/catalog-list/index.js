import {memo, useCallback, useEffect} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import { useDispatch, useSelector as useReduxSelector } from "react-redux";
import modalsActions from '@src/store-redux/modals/actions';
import addingActions from '@src/store-redux/adding/actions';
import shallowequal from "shallowequal";

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

  const selectRedux = useReduxSelector(state => ({
    articleId: state.adding.id,
    articleCount: state.adding.count,
    isAdding: state.adding.isAdd,
  }), shallowequal)

  const callbacks = {
    // Добавление в корзину
    //addToBasket: useCallback(_id => store.actions.basket.addToBasket(_id), [store]),
    arcticleCount: useCallback((_id, _title) => {
      dispatch(modalsActions.open("addToBasket"));
      dispatch(addingActions.open(_id, _title));
    }, [store]),
    // Пагинация
    onPaginate: useCallback(page => store.actions.catalog.setParams({page}), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({page, limit: select.limit, sort: select.sort, query: select.query})}`;
    }, [select.limit, select.sort, select.query])
  }

  const {t} = useTranslate();

  const renders = {
    item: useCallback(item => (
      <Item item={item} onAdd={callbacks.arcticleCount} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
    ), [callbacks.arcticleCount, t]),
  };

  useEffect(() => {
    if(selectRedux.isAdding) {
      store.actions.basket.addToBasket(selectRedux.articleId, selectRedux.articleCount);
      dispatch(addingActions.close());
    }
  }, [selectRedux.isAdding])

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.page} limit={select.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

export default memo(CatalogList);
