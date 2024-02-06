import ModalLayout from "@src/components/modal-layout";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import CatalogFilter from "../catalog-filter";
import useInit from "@src/hooks/use-init";
import SideLayout from "@src/components/side-layout";
import useModalId from "@src/hooks/use-modalId";
import CatalogListSelectable from "../catalog-list-selectable";
import { useCallback } from "react";

function ModalCatalog() {
  const store = useStore();
  const { t } = useTranslate();
  const modalId = useModalId();

  const storeName = "copyCatalog";
  const selectedItems = useSelector((state: any) => state[storeName].selected);

  useInit(() => {
    store.actions[storeName].initParams();
  }, [])

  const callbacks = {
    onClose: useCallback(() => {
      store.actions.modals.close(modalId);
      store.actions[storeName].resetSelectedItems();
      store.delete(storeName);
    }, [store, modalId]),
    onAddToBasket: useCallback(() => {
      store.actions.modals.close(modalId, selectedItems);
      store.actions[storeName].resetSelectedItems();
    }, [store, selectedItems, modalId]),
  }

  return (
    <ModalLayout
      labelClose={t("modal.close")}
      onClose={callbacks.onClose}
      title={t("modal.catalog")}
      isClose={false} >
      <SideLayout side="between" padding="medium">
        <CatalogFilter storeName={storeName} />
        <button onClick={callbacks.onAddToBasket}>{t("modal.add")}</button>
      </SideLayout>
      <CatalogListSelectable storeName={storeName} />
    </ModalLayout>
  );
}

export default ModalCatalog;
