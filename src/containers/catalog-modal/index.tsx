import { memo, useCallback, useState } from "react";
import ModalLayout from "@src/components/modal-layout";
import CatalogFilter from "@src/containers/catalog-filter";
import CatalogList from "@src/containers/catalog-list";
import useTranslate from "@src/hooks/use-translate";
import Controls from "@src/components/controls";
import useInit from "@src/hooks/use-init";
import useStore from "@src/hooks/use-store";
import { TArticle } from "@src/store/catalog/types";


export type TCatalogModal = {
  closeModal: (name: string, data: {} | number | null) => void;
};

const CatalogModal = (props:TCatalogModal) => {
  const { t } = useTranslate();
  const store = useStore();
  const [selectItem, setSelectItem] = useState<TArticle[]>([]);
  useInit(
    async () => {
      await Promise.all([store.actions.catalogModal.initParams(),
        store.actions.catalogModal.resetParams(),
      ]);
    },
    [store],
    true
  );

  const callbacks = {
    // Закрытие модалки каталога
    closeModal: () => {
      props.closeModal("catalog", null);
      store.actions.catalogModal.resetSelectItem();
      store.clear("catalogModal");
    },
    // Добавление в корзину нескольких товаров
    addToBasketSelectedItems: () => {
      props.closeModal("catalog", selectItem);
      setSelectItem([]);
      store.actions.catalogModal.resetSelectItem();
      store.clear("catalogModal");
    },
    // Выделение items
    onSelectItem: useCallback(
      (item:TArticle) => {
        store.actions.catalogModal.selectItem(item._id);
        setSelectItem((prevState) => {
          
          let exist = false;
          prevState.map((el:TArticle) => {        
            if (el._id === item._id) {
              exist = true;
            }
          });
          if (exist) {
            return prevState.filter((el:TArticle) => el._id !== item._id);
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
      <CatalogFilter storeName={"catalogModal" as any} />
      <CatalogList
        onSelect={callbacks.onSelectItem}
        storeName={"catalogModal" as any} 
      />
      <Controls
        onAdd={callbacks.addToBasketSelectedItems}
        title={t("catalog.modal")}
      />
    </ModalLayout>
  );
};

CatalogModal.defaultProps = {
  closeModal: () => {},
};

export default memo(CatalogModal);
