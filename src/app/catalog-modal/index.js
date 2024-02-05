import { memo, useCallback, useState } from "react";
import useTranslate from "@src/hooks/use-translate";
import ModalLayout from "@src/components/modal-layout";
import CatalogFilter from "@src/containers/catalog-filter";
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import CatalogModalList from "@src/containers/catalog-modal-list";
import PropTypes from "prop-types";
import SideLayout from "@src/components/side-layout";
import useNewState from "@src/hooks/use-new-state";

function CatalogModal({ closeModal }) {
  const store = useStore();
  const [selectedItems, setSelectedItems] = useState([]);
  const [stateName, isStateCreated] = useNewState("catalog-modal", "catalog", "catalog-modal")

  useInit(async () => {
    if (isStateCreated) {
      await Promise.all([
        store.actions[stateName].initParams(),
        store.actions.categories.load(),
      ]);
    }
  }, [stateName, isStateCreated]);

  const { t } = useTranslate();

  const callbacks = {
    onSendItems: useCallback(() => {
      closeModal(selectedItems);
    }, [selectedItems, closeModal]),
    onSelectItem: useCallback(
      (_id) => {
        setSelectedItems((items) => {
          const newItems = items.filter((itemId) => itemId !== _id);
          if (items.length !== newItems.length) {
            return newItems;
          }
          newItems.push(_id);
          return newItems;
        });
      },
      [setSelectedItems]
    ),
  };

  return (
    <ModalLayout
      title={
        t("catalog-modal.title") +
        " " +
        (selectedItems.length > 0
          ? `- ${t("catalog-modal.selected").toLowerCase()}:
            ${selectedItems.length} ${t(
              "basket.articles",
              selectedItems.length
            )}`
          : "")
      }
      labelClose={t("modal.close")}
      onClose={closeModal}
      footer={
        <SideLayout side={"end"}>
          <button
            onClick={callbacks.onSendItems}
            disabled={!selectedItems.length}
          >
            {t("catalog-modal.add")}
          </button>
        </SideLayout>
      }
    >
      {isStateCreated && (
        <>
          <CatalogFilter stateName={stateName} />
          <CatalogModalList
            stateName={stateName}
            onSelectItem={callbacks.onSelectItem}
            selectedItems={selectedItems}
          />
        </>
      )}
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
