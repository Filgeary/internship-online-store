import { memo, useCallback, useRef, useState } from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import { useDispatch, useSelector as useSelectorRedux } from "react-redux";
import useTranslate from "@src/hooks/use-translate";

import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import modalsActions from "@src/store-redux/modals/actions";
import ModalLayout from "@src/components/modal-layout";

import ItemSelectable from "@src/components/item-selectable";
import useInit from "@src/hooks/use-init";
import CatalogFilter from "@src/containers/catalog-filter";
import { ModalProps } from "../types";

function CatalogListModal({ onTop, id }: ModalProps) {
  const store = useStore();
  const dispatch = useDispatch();

  const [selectedItems, setSelectedItems] = useState([]);

  useInit(
    async () => {
      await Promise.all([
        store.actions.catalog2.initParams(
          store.actions.catalog2.initState().params
        ),
      ]);
    },
    [],
    true
  );

  const resolve = useSelectorRedux(
    //@ts-ignore
    (state) => state.modals.activeModals.find((el) => el.id === id).resolve
  );

  const select = useSelector((state) => ({
    list: state.catalog2.list,
    page: state.catalog2.params.page,
    limit: state.catalog2.params.limit,
    count: state.catalog2.count,
    waiting: state.catalog2.waiting,
  }));

  const promiseRef = useRef();

  useSelectorRedux((state) => {
    //@ts-ignore
    promiseRef.current = state.modals.activeModals.find(
      (el) => el.id === id
    )?.promise;
  });

  const callbacks = {
    selectItem: (_id) => {
      if (selectedItems.some((el) => el === _id)) {
        setSelectedItems((state) => state.filter((el) => el !== _id));
        return;
      }
      setSelectedItems((state) => [...state, _id]);
    },
    closeModal: useCallback(() => {
      //store.actions.modals.close();
      dispatch(modalsActions.close(id));
    }, [store]),
    // Пагинация
    onPaginate: useCallback(
      (page) => store.actions.catalog2.setParams({ page }),
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
        <ItemSelectable
          item={item}
          selectItem={() => callbacks.selectItem(item._id)}
          selected={selectedItems.some((el) => el === item._id)}
          link={`/articles/${item._id}`}
          labelAdd={t("article.add")}
        />
      ),
      [t, selectedItems]
    ),
  };

  return (
    <ModalLayout
      title={"Каталог"}
      labelClose={t("basket.close")}
      onClose={callbacks.closeModal}
      onTop={onTop}
    >
      <Spinner active={select.waiting}>
        <CatalogFilter catalog="catalog2" />
        <List list={select.list} renderItem={renders.item} />
        <Pagination
          count={select.count}
          page={select.page}
          limit={select.limit}
          onChange={callbacks.onPaginate}
          makeLink={callbacks.makePaginatorLink}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => resolve(selectedItems)}
            style={{ margin: "30px auto" }}
          >{`Добавить ${selectedItems.length} ${t(
            "basket.articles",
            selectedItems.length
          )}`}</button>
        </div>
      </Spinner>
    </ModalLayout>
  );
}

export default memo(CatalogListModal);
