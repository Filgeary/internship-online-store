import { useCallback } from "react";
import ModalLayout from "@src/components/modal-layout";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import CatalogFilter from "../catalog-filter";
import Paginator from "../paginator";
import List from "@src/components/list";
import Spinner from "@src/components/spinner";
import SelectableItem from "@src/components/selectable-item";
import useInit from "@src/hooks/use-init";
import SideLayout from "@src/components/side-layout";
import useModalId from "@src/hooks/use-modalId";

function ModalCatalog() {
  const store = useStore();
  const { t } = useTranslate();
  const modalId = useModalId();

  const select = useSelector((state) => ({
    list: state.catalogModal.list,
    waiting: state.catalogModal.waiting,
    selected: state.catalogModal.selected,
  }));

  useInit(() => {
    store.actions.catalogModal.initParams();
  }, [])


  const callbacks = {
    onClose: () => {
      store.actions.modals.close("catalog", modalId);
      store.actions.catalogModal.resetSelectedItems();
      store.actions.catalogModal.setIsModal(false);
    },
    onAddToBasket: () => {
      store.actions.modals.close("catalog", modalId, select.selected);
      store.actions.catalogModal.resetSelectedItems();
      store.actions.catalogModal.setIsModal(false);
    },
    onSelect: useCallback((_id) => store.actions.catalogModal.selectItem(_id), [store])
  }

  const renders = {
    items: useCallback(
      (item) => {
        let selected = false;
        if (select.selected.includes(item._id)) {
          selected = true;
        }
      return <SelectableItem item={item} selected={selected} onSelect={callbacks.onSelect} />
    },
      [callbacks.onSelect, select.selected, t]
    ),
  };

  return (
    <ModalLayout
      labelClose={t("modal.close")}
      onClose={callbacks.onClose}
      title={t("modal.catalog")}
    >
      <Spinner active={select.waiting}>
        <SideLayout side="between" padding="medium">
          <CatalogFilter storeName={"catalogModal"} />
          <button onClick={callbacks.onAddToBasket}>{t("modal.add")}</button>
        </SideLayout>
        <List list={select.list} renderItem={renders.items} />
        <Paginator storeName={"catalogModal"} />
      </Spinner>
    </ModalLayout>
  );
}

export default ModalCatalog;
