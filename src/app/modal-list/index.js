import React, {memo, useCallback, useEffect, useState} from 'react';
import CatalogFilter from "@src/containers/catalog-filter";
import CatalogList from "@src/containers/catalog-list";
import ModalLayout from "@src/components/modal-layout";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useInit from "@src/hooks/use-init";
import Spinner from "@src/components/spinner";

/**
 * Пометка, данный компонент является "умным"
 * */
function ModalList() {

  const {t} = useTranslate();

  const store = useStore();

  // Инициализирую только параметры по умолчанию из стора
  const [localState, setLocalState] = useState({
    ...store.actions.catalog.initState(),
    categories: [],
    selectList: {},
  })

  // Идентификатор загрузки будет дожидаться загрузки общих данных модалки
  const [waiting, setWaiting] = useState(false)

  const callbacks = {
    // Закрытие модалки
    closeModal: useCallback(() => {
      store.actions.modals.close(localState.selectList);
    }, [localState.selectList]),
    // Установка параметров "частично"
    setNewState: useCallback((state) => {
      setLocalState(prevState => ({
        ...prevState,
        ...state
      }))
    }, [localState]),
    // Установка новых параметров
    setParams: useCallback(async (newParams = {}) => {
      const paramsUpdate = {
        ...localState.params,
        ...newParams
      }
      const catalog = await store.actions.catalog.getNewValue(paramsUpdate)

      callbacks.setNewState({
        params: paramsUpdate,
        list: catalog.items,
        count: catalog.count
      })
    }, [localState]),
    // Сброс всех параметров
    resetParams: useCallback(() => callbacks.setParams(store.actions.catalog.initState().params), []),
  }

  useInit(async () => {
    // Здесь отдельно идет загрузка данных для модалки, чтобы никак не связывать ее со стэйтом
    setWaiting(true)
    // Получение новых параметров и данных и установка их в стэйт
    const catalog = await store.actions.catalog.getNewValue(localState.params)
    const categories = await store.actions.categories.getCategories()

    callbacks.setNewState({
      categories: categories.items,
      list: catalog.items,
      count: catalog.count
    })
    // Загрузка завершена
    setWaiting(false)
  }, []);

  return (
    <ModalLayout title={t('modalList.title')} onClose={callbacks.closeModal}>
      <Spinner active={waiting}>
        <CatalogFilter state={localState} params={localState}
                       setParams={callbacks.setParams} resetParams={callbacks.resetParams}/>
        <CatalogList setNewState={callbacks.setNewState} isModal={true}
                     state={localState} setParams={callbacks.setParams}/>
      </Spinner>
    </ModalLayout>
  );
}

export default memo(ModalList);
