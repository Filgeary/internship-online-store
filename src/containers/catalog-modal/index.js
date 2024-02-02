import React, { useCallback, useState, memo } from 'react';

import useStore from '@src/hooks/use-store';

import Modal from '@src/containers/modal';

import useTranslate from '@src/hooks/use-translate';

import CatalogList from '../catalog-list';
import CatalogFilter from '../catalog-filter';
import SuccessBlock from '@src/components/success-block';
import Entities from '@src/components/entities';

function CatalogModal() {
  const store = useStore();
  const [updatedItems, setUpdatedItems] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const callbacks = {
    closeModal: useCallback(() => {
      if (isSuccess) {
        store.actions.modals.closeByName('catalogModal', updatedItems);
      } else {
        store.actions.modals.closeByName('catalogModal', null, false);
      }

      store.actions.catalog.clearQueries();
    }, [store, updatedItems, isSuccess]),

    delete: (item) => {
      setUpdatedItems((prev) => {
        const newUpdatedItems = {...prev};
        delete newUpdatedItems[item._id];

        return newUpdatedItems;
      });
    },

    update: (item) => {
      setUpdatedItems({
        ...updatedItems,
        [item._id]: updatedItems[item._id] ? updatedItems[item._id] + 1 : 1,
      });
      setIsSuccess(false);
    },

    setSuccessToAdd: () => {
      setIsSuccess(true);
    },
  };

  const options = {
    watchQueries: true,
    ignoreHistory: true,
    isBtnDisabled: Object.keys(updatedItems).length === 0 || isSuccess,
  };

  const renders = {
    appendixText: (count) => t('catalogModal.appendixItemText').replace(/\[:count:\]/gi, count),
  };

  const {t} = useTranslate();

  const closeBasketModal = () => store.actions.modals.closeByName('basket');

  return (
    <Modal
      onClose={callbacks.closeModal}
      title={t('catalogModal.title')}
    >
      <CatalogFilter
        stateName="separateCatalog"
        ignoreHistory={options.ignoreHistory}
      />
      <CatalogList
        countOfItems={updatedItems}
        onItemClick={callbacks.update}
        isItemsSelectable={true}
        isItemsDeletable={true}
        onDeleteItem={callbacks.delete}
        ignoreHistory={options.ignoreHistory}
        stateName="separateCatalog"
        appendixOfItem={renders.appendixText}
      />

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

        <button onClick={closeBasketModal}>Закрыть модалку корзины</button>
      </Entities>
    </Modal>
  );
}

export default memo(CatalogModal);
