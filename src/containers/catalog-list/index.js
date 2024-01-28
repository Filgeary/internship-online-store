import {memo, useCallback, useEffect} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import { useDispatch, useSelector as useSelectorRedux } from "react-redux";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import modalsActions from "@src/store-redux/modals/actions";
import activeActions from "@src/store-redux/count/actions";
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

  const selectRedux = useSelectorRedux(
    (state) => ({
      _id: state.active._id,
      count: state.active.count
    }),
    shallowequal
  );

  useEffect(() => {
    if (selectRedux.count) {
      store.actions.basket.addToBasket(selectRedux._id, selectRedux.count);
      dispatch(activeActions.reset());
    }
  }, [selectRedux.count]);

  const callbacks = {
    // Пагинация
    onPaginate: useCallback(
      (page) => store.actions.catalog.setParams({ page }),
      [store]
    ),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback(
      (page) => {
        return `?${new URLSearchParams({
          page,
          limit: select.limit,
          sort: select.sort,
          query: select.query,
        })}`;
      },
      [select.limit, select.sort, select.query]
    ),
    openCountItemModal:
      ( _id ) => {
        dispatch(activeActions.setActive(_id));
        dispatch(modalsActions.open("count"));
      }
  };

  const {t} = useTranslate();

  const renders = {
    item: useCallback(item => (
      <Item item={item} onOpenModal={callbacks.openCountItemModal} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
    ), [callbacks.openCountItemModal, t]),
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
