import React, { memo, useCallback, useState } from "react";
import ModalLayout from "@src/components/modal-layout";
import CatalogFilter from "@src/containers/catalog-filter";
import CatalogList from "@src/containers/catalog-list";
import useTranslate from "@src/hooks/use-translate";
import PropTypes from "prop-types";
import Controls from "@src/components/controls";
import useInit from "@src/hooks/use-init";
import useStore from "@src/hooks/use-store";

const CatalogModal = (props) => {
  const { t } = useTranslate();
  const store = useStore();
  const [selectItem, setSelectItem] = useState([]);
  useInit(
    async () => {
      await Promise.all([store.actions.catalogModal.initParams()]);
    },
    [],
    true
  );

  const callbacks = {
    // Закрытие модалки каталога
    closeModal: (e) => {
      props.closeModal("catalog", null);
      store.actions.catalogModal.resetSelectItem();
      store.clear("catalogModal");
    },
    // Добавление в корзину нескольких товаров
    addToBasketSelectedItems: (e) => {
      props.closeModal("catalog", selectItem);
      setSelectItem([]);
      store.actions.catalogModal.resetSelectItem();
      store.clear("catalogModal");
    },
    // Выделение items
    onSelectItem: useCallback(
      (item) => {
        store.actions.catalogModal.selectItem(item._id);
        setSelectItem((prevState) => {
          let exist = false;
          prevState.map((el) => {
            if (el._id === item._id) {
              exist = true;
            }
          });
          if (exist) {
            return prevState.filter((el) => el._id !== item._id);
          } else {
            return [...prevState, { ...item, selected: true }];
          }
        });
      },
      [store]
    ),
  };
  return (
    <ModalLayout
      title={t("catalog")}
      labelClose={t("count.form.cancel")}
      onClose={callbacks.closeModal}
      code={true}
    >
      <CatalogFilter storeName={"catalogModal"} />
      <CatalogList
        onSelect={callbacks.onSelectItem}
        storeName={"catalogModal"}
      />
      <Controls
        onAdd={callbacks.addToBasketSelectedItems}
        title={t("catalog.modal")}
      />
    </ModalLayout>
  );
};

CatalogModal.propTypes = {
  closeModal: PropTypes.func,
};

CatalogModal.defaultProps = {
  closeModal: () => {},
};

export default memo(CatalogModal);
