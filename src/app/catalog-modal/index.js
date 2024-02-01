import { memo, useCallback, useMemo } from "react";
import useTranslate from "@src/hooks/use-translate";
import ModalLayout from "@src/components/modal-layout";
import CatalogFilter from "@src/containers/catalog-filter";
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import CatalogModalList from "@src/containers/catalog-modal-list";
import useSelector from "@src/hooks/use-selector";
import PropTypes from "prop-types";
import SideLayout from "@src/components/side-layout";

function CatalogModal({ closeModal }) {
  const store = useStore();

  useInit(async () => {
    await store.actions.catalogModal.reset;
    await Promise.all([
      store.actions.catalogModal.initParams(),
      store.actions.categories.load(),
    ]);
  }, []);

  const { selectedItems, sizeSelectedItems } = useSelector((state) => {
    const selectedItems = state.catalogModal.selectedItems;
    return {
      selectedItems,
      sizeSelectedItems: selectedItems.size,
    };
  });

  const { t } = useTranslate();

  const callbacks = {
    onSendItems: useCallback(() => {
      closeModal(Array.from(selectedItems));
    }, [selectedItems, closeModal]),
  };

  return (
    <ModalLayout
      title={
        t("catalog-modal.title") +
        " " +
        (sizeSelectedItems > 0
          ? `- ${t("catalog-modal.selected").toLowerCase()}: 
            ${sizeSelectedItems} ${t("basket.articles",sizeSelectedItems)}`
          : "")
      }
      labelClose={t("modal.close")}
      onClose={closeModal}
      footer={
        <SideLayout side={"end"}>
          <button onClick={callbacks.onSendItems}>
            {t("catalog-modal.add")}
          </button>
        </SideLayout>
      }
    >
      <CatalogFilter stateName={"catalogModal"} />
      <CatalogModalList />
    </ModalLayout>
  );
}

CatalogModal.propTypes = {
  closeModal: PropTypes.func,
};

CatalogModal.defaultProps = {
  closeModal: (result) => {},
};

export default memo(CatalogModal);
