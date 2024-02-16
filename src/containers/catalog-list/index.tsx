import { memo, useCallback } from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import { useDispatch } from "react-redux";
import modalsActions from "@src/store-redux/modals/actions";
import { useSelector as useSelectorRedux } from "react-redux";
import { TArticle } from "@src/store/article/types";


export type TCatalogList = {
  onSelect: (item: TArticle) => void;
  storeName: "catalog";
};

function CatalogList(props: TCatalogList) {
  const store = useStore();
  const dispatch = useDispatch();
  const activeModal = useSelectorRedux((state: any) => state.modals);

  const select = useSelector((state) => ({
    list: state[props.storeName].list,
    page: state[props.storeName].params.page,
    limit: state[props.storeName].params.limit,
    sort: state[props.storeName].params.sort,
    query: state[props.storeName].params.query,
    count: state[props.storeName].count,
    waiting: state[props.storeName].waiting,
  }));

  const callbacks = {
    // Выделение товара
    selectItem: (item: TArticle) => {
      props.onSelect(item);
    },

    // Открытие модалки ввода количества товара
    openCountModal: useCallback(
      (_id: string | number) => {
        store.actions.basket.addToActive(_id);
        dispatch(modalsActions.open("counter"));
      },
      [store]
    ),
    // Добавление в корзину
    // addToBasket: useCallback(_id => store.actions.basket.addToBasket(_id), [store]),
    // Пагинация
    onPaginate: useCallback(
      (page: number | null) =>
        store.actions[props.storeName].setParams({ page }),
      [store]
    ),
    // генератор ссылки для пагинатора

    makePaginatorLink: useCallback(
      (page: number) => {
        return `?${new URLSearchParams({
          page,
          limit: select.limit,
          sort: select.sort,
          query: select.query,
        } as {})}`;
      },
      [select.limit, select.sort, select.query]
    ),
  };

  const { t } = useTranslate();

  const renders = {
    item: useCallback(
      (item: TArticle) => (
        <Item
          item={item}
          onAdd={callbacks.openCountModal}
          link={`/articles/${item._id}`}
          labelAdd={t("article.add")}
          catalog={activeModal.catalog}
          onSelect={callbacks.selectItem}
          storeName={props.storeName}
        />
      ),
      [t]
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
        indent={1}
      />
    </Spinner>
  );
}

CatalogList.defaultProps = {
  onSelect: () => {},
  storeName: "catalog",
};

export default memo(CatalogList);
