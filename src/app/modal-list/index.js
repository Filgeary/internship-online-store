import React, {memo, useCallback, useEffect, useState} from 'react';
import CatalogFilter from "@src/containers/catalog-filter";
import CatalogList from "@src/containers/catalog-list";
import ModalLayout from "@src/components/modal-layout";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useInit from "@src/hooks/use-init";
import Spinner from "@src/components/spinner";
import Controls from "@src/components/controls";
import CatalogListSelected from "@src/containers/catalog-list-selected";

/**
 * Пометка, данный компонент является "умным"
 * */
function ModalList({onClose}) {

  const {t} = useTranslate();

  const store = useStore();

  // Состояние загрузки
  const [waiting, setWaiting] = useState(false)
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
    setWaiting(true)
    // Загружаем список в любом случае, но конкретно в созданную стора
    await Promise.all([
      store.actions['modal-catalog'].setParams({}, false, false),
      store.actions.categories.load()
    ])
    setWaiting(false)
  }, [])

  return (
      <ModalLayout title={t('modalList.title')} onClose={callbacks.closeModal}>
        <Spinner active={waiting}>

          <CatalogFilter stateName={'modal-catalog'}/>
          <CatalogListSelected stateName={'modal-catalog'} selectedList={selectedList}
                               onUpdateSelectedList={setSelectedList}/>
          <Controls title={'Ok'} onAdd={() => callbacks.handleSubmit()}/>

        </Spinner>

      </ModalLayout>
  );
}

export default memo(ModalList);
