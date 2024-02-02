import { useCallback } from "react";
import ModalLayout from "@src/components/modal-layout";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import CatalogFilter from "../catalog-filter";
import useInit from "@src/hooks/use-init";
import SideLayout from "@src/components/side-layout";
import useModalId from "@src/hooks/use-modalId";
import CatalogListSelectable from "../catalog-list-selectable";

function ModalCatalog() {
  const store = useStore();
  const { t } = useTranslate();
  const modalId = useModalId();

  const selectedItems = useSelector((state) => state.catalogModal.selected);

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
      store.actions.modals.close("catalog", modalId, selectedItems);
      store.actions.catalogModal.resetSelectedItems();
      store.actions.catalogModal.setIsModal(false);
    },
  }

  return (
    <ModalLayout
      labelClose={t("modal.close")}
      onClose={callbacks.onClose}
      title={t("modal.catalog")}
    >
      <SideLayout side="between" padding="medium">
        <CatalogFilter storeName={"catalogModal"} />
        <button onClick={callbacks.onAddToBasket}>{t("modal.add")}</button>
      </SideLayout>
      <CatalogListSelectable storeName={"catalogModal"} />
    </ModalLayout>
  );
}

export default ModalCatalog;
