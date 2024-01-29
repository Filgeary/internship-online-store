import React, { useCallback, useState, memo } from 'react';
import { useDispatch } from 'react-redux';

import useStore from '@src/hooks/use-store';
import useSelector from "@src/hooks/use-selector";
import modalsActions from '@src/store-redux/modals/actions';

import Modal from '@src/containers/modal';
import CountForm from '@src/components/count-form';

import useTranslate from '@src/hooks/use-translate';
import CatalogList from '../catalog-list';
import CatalogFilter from '../catalog-filter';

function CatalogModal() {
  const callbacks = {
    
  };

  return (
    <Modal
      title={'Список товаров'}
      labelClose={'Закрыть'}
    >
      <CatalogFilter />
      <CatalogList isItemsSelectable={true} />
    </Modal>
  );
}

export default memo(CatalogModal);
