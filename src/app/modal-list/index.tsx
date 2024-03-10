import React, {memo, useCallback, useState} from 'react';
import CatalogFilter from "@src/containers/catalog-filter";
import ModalLayout from "@src/components/modal-layout";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import Spinner from "@src/components/spinner";
import Controls from "@src/components/controls";
import CatalogListSelected from "@src/containers/catalog-list-selected";
import {onCloseModal} from "@src/containers/modal-window";

/**
 * Пометка, данный компонент является "умным"
 * */
function ModalList({onClose}: { onClose: onCloseModal }) {

  const {t} = useTranslate();

  const store = useStore();

  // Состояние загрузки
  const [waiting, setWaiting] = useState(true)
  // Лист выбранных товаров
  const [selectedList, setSelectedList] = useState({})

  const callbacks = {
    // Закрытие модалки
    closeModal: useCallback(() => {
      onClose({});
    }, [selectedList]),
    handleSubmit: useCallback(() => {
      onClose(selectedList)
    }, [selectedList])
  }

  useInit(async () => {
    store.makeCopy('catalog-modal', 'catalog', {entryURLParams: false})
    // Загружаем список в любом случае, но конкретно в созданную стора
    await Promise.all([
      store.actions['catalog-modal'].setParams({}, false),
      store.actions.categories.load(),
      store.actions.countries.load()
    ])
    setWaiting(false)
    return () => {
      store.deleteCopy('catalog-modal')
    }
  }, [])

  return (
      <ModalLayout title={t('modalList.title')} onClose={callbacks.closeModal}>
        <Spinner active={waiting}>
          {!waiting && <>
            <CatalogFilter stateName={'catalog-modal'}/>
            <CatalogListSelected stateName={'catalog-modal'} selectedList={selectedList}
                                 onUpdateSelectedList={setSelectedList}/>
            <Controls title={'Ok'} onAdd={() => callbacks.handleSubmit()}/>
          </>}
        </Spinner>

      </ModalLayout>
  );
}

export default memo(ModalList);
