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

  const selectedItems = useSelector((state) => state.copyCatalog.selected);

  useInit(() => {
    store.actions.copyCatalog.initParams();
  }, [])

  const callbacks = {
    onClose: () => {
      store.actions.modals.close("catalog", modalId);
      store.actions.copyCatalog.resetSelectedItems();
    },
    onAddToBasket: () => {
      store.actions.modals.close("catalog", modalId, selectedItems);
      store.actions.copyCatalog.resetSelectedItems();
    },
  }

  return (
    <ModalLayout
      labelClose={t("modal.close")}
      onClose={callbacks.onClose}
      title={t("modal.catalog")}
    >
      <SideLayout side="between" padding="medium">
        <CatalogFilter storeName={"copyCatalog"} />
        <button onClick={callbacks.onAddToBasket}>{t("modal.add")}</button>
      </SideLayout>
      <CatalogListSelectable storeName={"copyCatalog"} />
    </ModalLayout>
  );
}

export default ModalCatalog;
