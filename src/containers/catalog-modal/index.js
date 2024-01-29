import React, { useCallback, useState, memo } from 'react';

import useStore from '@src/hooks/use-store';
import useSelector from "@src/hooks/use-selector";

import Modal from '@src/containers/modal';

import useTranslate from '@src/hooks/use-translate';
import CatalogList from '../catalog-list';
import CatalogFilter from '../catalog-filter';

function CatalogModal() {
  const store = useStore();
  const [updatedItems, setUpdatedItems] = useState({});

  const callbacks = {
    closeModal: useCallback(() => {
      const basketFn = async () => {
        console.log('UpdatedItems:', updatedItems);
        store.actions.basket.addMany(updatedItems);
        store.actions.modals.resetDataObj();
      };
      // dispatch(modalsActions.close({ basketFn }));
      store.actions.modals.close({ basketFn });
    }, [store, updatedItems]),

    update: (item) => {
      setUpdatedItems({
        ...updatedItems,
        [item._id]: updatedItems[item._id] ? updatedItems[item._id] + 1 : 1,
      });
    },
  };

  const {t} = useTranslate();

  return (
    <Modal
      onClose={callbacks.closeModal}
      title={t('catalogModal.title')}
    >
      <CatalogFilter />
      <CatalogList
        countOfItems={updatedItems}
        onItemClick={callbacks.update}
        isItemsSelectable={true}
      />
    </Modal>
  );
}

export default memo(CatalogModal);
