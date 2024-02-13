import { memo, useCallback, useMemo, useState } from "react";
import useTranslate from "@src/hooks/use-translate";
import ModalLayout from "@src/components/modal-layout";
import CatalogFilter from "@src/containers/catalog-filter";
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import CatalogModalList from "@src/containers/catalog-modal-list";
import PropTypes from "prop-types";
import SideLayout from "@src/components/side-layout";
import useNewState from "@src/hooks/use-new-state";
import useStoreState from "@src/hooks/use-store-state";

function CatalogModal({ closeModal }) {
  const store = useStore();
  const [selectedItems, setSelectedItems] = useState([]);
  const stateName = useStoreState("catalog", "catalogModal");

  useInit(async () => {
    await Promise.all([
      store.actions[stateName].initParams(),
      store.actions.categories.load(),
    ]);
  }, [stateName]);

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

  const options = {
    modalTitle: useMemo(() => {
      let str = t("catalog-modal.title");
      const itemsCount = selectedItems.length;
      if (itemsCount > 0) {
        str += ` - ${t(
          "catalog-modal.selected"
        ).toLowerCase()}: ${itemsCount} ${t("basket.articles", itemsCount)}`;
      }
      return str;
    }, [selectedItems, t]),
  };

  return (
    <ModalLayout
      title={options.modalTitle}
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
      <CatalogFilter stateName={stateName} />
      <CatalogModalList
        stateName={stateName}
        onSelectItem={callbacks.onSelectItem}
        selectedItems={selectedItems}
      />
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
