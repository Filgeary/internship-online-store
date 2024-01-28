import {memo, useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import { useDispatch } from "react-redux";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import modalsActions from "@src/store-redux/modals/actions";
import activeActions from "@src/store-redux/count/actions";

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
      ( item ) => {
        dispatch(activeActions.setActive(item));
        dispatch(modalsActions.open("count"));
      }

  };

  const {t} = useTranslate();

  const renders = {
    item: useCallback(item => (
      <Item item={item} onAdd={callbacks.openCountItemModal} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
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
