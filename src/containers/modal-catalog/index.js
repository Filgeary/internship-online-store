import { memo, useCallback, useState } from "react";

import ModalLayout from "@src/components/modal-layout";
import SideLayout from "@src/components/side-layout";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import CatalogFilter from "../catalog-filter";
import CatalogList from "../catalog-list";

const ModalCatalog = () => {
  const store = useStore();
  const { t } = useTranslate();
  const [selectedItems, setSelectedItems] = useState([]);

  const callbacks = {
    closeModal: useCallback(
      (data) => {
        store.actions.modals.close("modalCatalog", data);
      },
      [store]
    ),
    handleSelectItem: useCallback(
      (id, isAdding) => {
        if (isAdding) {
          setSelectedItems((prevState) => [...prevState, id]);
        } else {
          setSelectedItems((prevState) =>
            prevState.filter((item) => item !== id)
          );
        }
      },
      [selectedItems, setSelectedItems]
    ),
  };

  return (
    <ModalLayout
      title={t("modalCatalog.title")}
      labelClose={t("modal.close")}
      onClose={() => callbacks.closeModal([])}
    >
      <SideLayout side="end" padding="medium">
        <span>
          {t("modalCatalog.selectedProducts")}:{" "}
          <strong>{selectedItems.length}</strong>
        </span>
        <button
          onClick={() => callbacks.closeModal(selectedItems)}
          disabled={selectedItems.length === 0}
        >
          {t("modalCatalog.addProducts")}
        </button>
      </SideLayout>

      <CatalogFilter />
      <CatalogList
        isSelectionMode={true}
        onSelectItem={callbacks.handleSelectItem}
        selectedItems={selectedItems}
      />
    </ModalLayout>
  );
};

export default memo(ModalCatalog);
