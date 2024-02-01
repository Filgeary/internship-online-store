import React, {memo, useCallback, useState} from 'react';
import {useDispatch} from "react-redux";
import useTranslate from "@src/hooks/use-translate";
import useSelector from "@src/hooks/use-selector";
import Basket from "@src/app/basket";
import ModalAddBasket from "@src/components/modal-add-basket";
import ModalList from "@src/app/modal-list";
import codeGenerator from "@src/utils/code-generator";
import useStore from "@src/hooks/use-store";

function ModalWindow() {
  const store = useStore()
  const {t} = useTranslate();

  const key = codeGenerator()

  const select = useSelector(state => ({
    modalsList: state.modals.modalsList,
  }))

  const callbacks = {
    onClose: useCallback((result) => {
      store.actions.modals.close(result)
    }, [])
  }

  return (
    <>
      {select.modalsList.map(modal => {
        switch (modal.name) {
          case 'basket':
            return <div key={key()}>
              <Basket/>
            </div>
          case 'adding':
            return <div key={key()}>
              <ModalAddBasket onClose={callbacks.onClose} data={modal.data} t={t}/>
            </div>
          case 'modalList':
            return <div key={key()}>
              <ModalList/>
            </div>
        }
      })}
    </>
  );
}

export default memo(ModalWindow);
