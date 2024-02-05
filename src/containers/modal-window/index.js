import React, {memo, useCallback, useMemo, useState} from 'react';
import {useDispatch} from "react-redux";
import useTranslate from "@src/hooks/use-translate";
import useSelector from "@src/hooks/use-selector";
import Basket from "@src/app/basket";
import ModalAddBasket from "@src/components/modal-add-basket";
import ModalList from "@src/app/modal-list";
import codeGenerator from "@src/utils/code-generator";
import useStore from "@src/hooks/use-store";
import Backdrop from "@src/components/backdrop";
import useInit from "@src/hooks/use-init";

function ModalWindow() {
  const store = useStore()
  const {t} = useTranslate();

  const select = useSelector(state => ({
    modalsList: state.modals.modalsList,
  }))

  const callbacks = {
    // Эта функция создает функцию закрытия определенного модального окна, то есть с помощью замыкания при создании модального окна мы передаем туда id текущего модального окна, но так же можно будет закрыть другое модальное окно по id
    onClose: useCallback((_id) => (result, idModal = _id) => store.actions.modals.close(result, idModal), [])
  }

  useInit(() => {
    // Для одного из модальных окон необходимо создать определенный стор
    store.make('modal-catalog', 'catalog')
  }, [])

  return (
    <>
      <Backdrop isOpen={select.modalsList.length > 0}/>
      {select.modalsList.map(modal => {
        switch (modal.name) {
          case 'basket':
            return <div key={modal._id}>
              <Basket onClose={callbacks.onClose(modal._id)}/>
            </div>
          case 'adding':
            return <div key={modal._id}>
              <ModalAddBasket onClose={callbacks.onClose(modal._id)} data={modal.data} t={t}/>
            </div>
          case 'modalList':
            return <div key={modal._id}>
              <ModalList onClose={callbacks.onClose(modal._id)}/>
            </div>
        }
      })}
    </>
  );
}

export default memo(ModalWindow);
