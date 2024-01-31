import React, { memo, useState } from "react";
import ModalLayout from "@src/components/modal-layout";
import CatalogFilter from "@src/containers/catalog-filter";
import CatalogList from "@src/containers/catalog-list";
import useTranslate from "@src/hooks/use-translate";
import PropTypes from "prop-types";

const CatalogModal = (props) => {
  const { t } = useTranslate();
  const [selectItem, setSelectItem] = useState([]);

  const callbacks = {
    // Закрытие модалки каталога
    closeModal: () => {
      props.closeModal(selectItem);
    },
    // Выбор и выделение товара в каталоге
    onSelectItem: (item) => {
      setSelectItem((prevState) => {
        let exist = false;
        prevState.map((el) => {
          if (el.id === item._id) {
            exist = true;
          }
        });
        if (exist) {
          return prevState.filter((el) => el.id !== item._id);
        } else {
          return [...prevState, { id: item._id, selected: true }];
        }
      });
    },
  };
  return (
    <ModalLayout
      title={t("catalog")}
      labelClose={t("basket.close")}
      onClose={callbacks.closeModal}
    >
      <CatalogFilter />
      <CatalogList onSelect={callbacks.onSelectItem} />
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
