import { memo, useCallback, useEffect, useState } from "react";

import ModalLayout from "@src/components/modal-layout";
import SideLayout from "@src/components/side-layout";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import CatalogFilter from "../catalog-filter";
import CatalogList from "../catalog-list";

const ModalCatalog = ({ onClose }) => {
  const store = useStore();
  const { t } = useTranslate();
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const init = async () => await store.actions["modalCatalog"].initParams();
    init();
  }, []);

  const callbacks = {
    closeModal: useCallback(data => onClose(data), [onClose]),
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

      <CatalogFilter catalogSliceName="modalCatalog" />
      <CatalogList
        catalogSliceName="modalCatalog"
        isSelectionMode={true}
        onSelectItem={callbacks.handleSelectItem}
        selectedItems={selectedItems}
      />
    </ModalLayout>
  );
};

export default memo(ModalCatalog);
