import { useCallback, useState, memo } from "react";
import ModalLayout from "@src/components/modal-layout";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import CatalogFilter from "../catalog-filter";
import Paginator from "../paginator";
import List from "@src/components/list";
import Spinner from "@src/components/spinner";
import ItemModal from "@src/components/item-modal";

function ModalCatalog() {
  const store = useStore();
  const { t } = useTranslate();

  const select = useSelector((state) => ({
    list: state.catalog.list,
    waiting: state.catalog.waiting,
    selected: state.catalog.selected
  }));

  const callbacks = {
    onClose: () => store.actions.modals.close(select.selected),
    onSelect: useCallback((_id) => store.actions.catalog.selectItem(_id), [store])
  }

  const renders = {
    items: useCallback(
      (item) => <ItemModal item={item} onSelect={callbacks.onSelect} />,
      [callbacks.onSelect, t]
    ),
  };


  return (
    <ModalLayout
      labelClose={t("modal.close")}
      onClose={callbacks.onClose}
      title={t("modal.catalog")}
    >
      <Spinner active={select.waiting}>
        <CatalogFilter />
        <List list={select.list} renderItem={renders.items} />
        <Paginator />
      </Spinner>
    </ModalLayout>
  );
}

export default memo(ModalCatalog);
