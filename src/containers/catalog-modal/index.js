import React, { useCallback, useState, memo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';

import useStore from '@src/hooks/use-store';
import useSelector from "@src/hooks/use-selector";
import modalsActions from '@src/store-redux/modals/actions';

import Modal from '@src/containers/modal';
import CountForm from '@src/components/count-form';

import useTranslate from '@src/hooks/use-translate';
import CatalogList from '../catalog-list';
import CatalogFilter from '../catalog-filter';

function CatalogModal() {
  const store = useStore();
  const dispatch = useDispatch();
  const [updatedItems, setUpdatedItems] = useState({});

  const callbacks = {
    closeModal: useCallback(() => {
      const basketFn = async () => {
        console.log('UpdatedItems:', updatedItems);
        for (const itemId in updatedItems) {
          await store.actions.basket.addToBasket(itemId, updatedItems[itemId]);
        }
      };
      dispatch(modalsActions.close({ basketFn }));
    }, [store, updatedItems]),

    update: (item) => {
      setUpdatedItems({
        ...updatedItems,
        [item._id]: updatedItems[item._id] ? updatedItems[item._id] + 1 : 1,
      });
    },
  };

  return (
    <Modal
      onClose={callbacks.closeModal}
      title={'Список товаров'}
      labelClose={'Закрыть'}
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
