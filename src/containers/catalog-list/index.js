import { memo, useCallback, useRef } from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import { useDispatch, useSelector as useSelectorRedux } from "react-redux";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import modalsActions from "@src/store-redux/modals/actions";
import CountModal from "../count-modal";

function CatalogList() {
  const store = useStore();
  const dispatch = useDispatch();

  const activeModal = useSelectorRedux((state) => state.modals);

  const select = useSelector((state) => ({
    list: state.catalog.list,
    page: state.catalog.params.page,
    limit: state.catalog.params.limit,
    count: state.catalog.count,
    waiting: state.catalog.waiting,
  }));

  const promiseRef = useRef();

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(
      async (_id, title) => {
        const showCountPicker = () => {
          dispatch(modalsActions.open("count-picker", title));

          return new Promise((resolve, reject) => {
            promiseRef.current = { resolve, reject };
          });
        };
        try {
          const count = await showCountPicker();
          store.actions.basket.addToBasket(_id, count);
        } catch (e) {
          console.log(e);
        }
      },
      [store]
    ),
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
  };

  const { t } = useTranslate();

  const renders = {
    item: useCallback(
      (item) => (
        <Item
          item={item}
          onAdd={callbacks.addToBasket}
          link={`/articles/${item._id}`}
          labelAdd={t("article.add")}
        />
      ),
      [callbacks.addToBasket, t]
    ),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item} />
      <Pagination
        count={select.count}
        page={select.page}
        limit={select.limit}
        onChange={callbacks.onPaginate}
        makeLink={callbacks.makePaginatorLink}
      />
      {activeModal.name === "count-picker" && (
        <CountModal
          onAdd={promiseRef.current.resolve}
          onCancel={promiseRef.current.reject}
          title={activeModal.title}
        />
      )}
    </Spinner>
  );
}

export default memo(CatalogList);
