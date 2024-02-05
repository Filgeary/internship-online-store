import React, { useCallback, useState, memo, useEffect } from 'react';

import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';
import useModalId from '@src/hooks/use-modal-id';
import useCloseParentFn from '@src/hooks/use-close-parent-fn';

import Modal from '@src/containers/modal';
import CatalogFilter from '../catalog-filter';
import SuccessBlock from '@src/components/success-block';
import Entities from '@src/components/entities';
import CatalogListAppend from '../catalog-list-append';
import Catalog from '../catalog';
import { TItem } from '@src/types/item';

function CatalogModal() {
  const store = useStore();
  const [updatedItems, setUpdatedItems] = useState<Record<string, number>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  
  const modalId = useModalId();
  const closeParentFn = useCloseParentFn(modalId);

  useEffect(() => {
    store.actions.separateCatalog.initParams();
  }, []);

  const callbacks = {
    closeModal: useCallback(() => {
      if (isSuccess) {
        store.actions.modals.closeById(modalId, updatedItems);
      } else {
        store.actions.modals.closeById(modalId, null, false);
      }
    }, [store, updatedItems, isSuccess, modalId]),

    delete: useCallback((item: TItem) => {
      setUpdatedItems((prev) => {
        const newUpdatedItems = {...prev};
        delete newUpdatedItems[item._id];

        return newUpdatedItems;
      });
    }, [updatedItems]),

    update: (item: TItem) => {
      setUpdatedItems({
        ...updatedItems,
        [item._id]: updatedItems[item._id] ? updatedItems[item._id] + 1 : 1,
      });
      setIsSuccess(false);
    },

    setSuccessToAdd: () => {
      setIsSuccess(true);
    },

    closeParent: () => closeParentFn(),
  };

  const options = {
    isBtnDisabled: Object.keys(updatedItems).length === 0 || isSuccess,
  };

  const renders = {
    appendixText: (count: any) => t('catalogModal.appendixItemText').replace(/\[:count:\]/gi, count),
  };

  const {t} = useTranslate();

  // const closeBasketModal = () => store.actions.modals.closeByName('basket');
  // const closeBasketModalStart = () => store.actions.modals.closeByName('basket', null, true, false);
  // const openAnotherCatalogModal = () => store.actions.modals.open('catalogModal').then((items) => alert(JSON.stringify(items))).catch(() => {}); 

  return (
    <Modal
      onClose={callbacks.closeModal}
      title={t('catalogModal.title')}
    >
      <Catalog stateName="separateCatalog">
        <CatalogFilter />

        <CatalogListAppend
          countOfItems={updatedItems}
          onItemClick={callbacks.update}
          onItemDelete={callbacks.delete}
          appendixOfItem={renders.appendixText}
        />
      </Catalog>

      <Entities>
        {
          isSuccess && (
            <SuccessBlock>
              {t('catalogModal.successText')}
            </SuccessBlock>
          )
        }

        <button disabled={options.isBtnDisabled} onClick={callbacks.setSuccessToAdd}>
          {t('catalogModal.btnSuccess')}
        </button>

        {/* <button onClick={callbacks.closeParent}>Закрыть родительскую модалку</button>
        <button onClick={closeBasketModal}>Закрыть модалку корзины (последнюю)</button>
        <button onClick={closeBasketModalStart}>Закрыть модалку корзины (первую)</button>
        <button onClick={openAnotherCatalogModal}>Открыть ещё одну модалку каталога</button> */}
      </Entities>
    </Modal>
  );
}

export default memo(CatalogModal);
