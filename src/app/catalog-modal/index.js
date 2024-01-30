import ModalLayout from '@src/components/modal-layout'
import PageLayout from '@src/components/page-layout'
import CatalogFilter from '@src/containers/catalog-filter'
import CatalogList from '@src/containers/catalog-list'
import useStore from '@src/hooks/use-store'
import useTranslate from '@src/hooks/use-translate'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import  modalsActions  from '@src/store-redux/modals/actions';

const CatalogModal = () => {
  const {t} = useTranslate();
  const store = useStore();
  const dispatch = useDispatch();
  const callbacks = {
  
    // Закрытие модалки каталога
    closeModal: useCallback(() => {
      dispatch(modalsActions.close('catalog'));
    }, [store]),
  }
  return (
    <ModalLayout  title={t('catalog')} labelClose={t('basket.close')} onClose={callbacks.closeModal} >
      <PageLayout>
        <CatalogFilter />
        <CatalogList />
      </PageLayout>
    </ModalLayout>
  )
}

export default CatalogModal