import React, {memo} from 'react';
import useTranslate from "@src/shared/hooks/use-translate";
import useSelector from "@src/shared/hooks/use-selector";
import ModalAddBasket from "@src/feature/modal-add-basket";
import ModalList from "@src/feature/modal-list";
import useStore from "@src/shared/hooks/use-store";
import Backdrop from "@src/shared/ui/layout/backdrop";
import Basket from "@src/pages/basket";

export type onCloseModal = (result: unknown, idModal?: number) => void

function ModalWindow() {
  const store = useStore()
  const {t}: any = useTranslate();

  const select = useSelector((state) => ({
    modalsList: state.modals.modalsList,
  }))

  // Эта функция создает функцию закрытия определенного модального окна, то есть с помощью замыкания при создании модального окна мы передаем туда id текущего модального окна, но так же можно будет закрыть другое модальное окно по id
  const onClose = (_id: number) => (result: any, idModal = _id): void => store.actions.modals.close(result, idModal)

  return (
    <>
      {select.modalsList.map((modal: any, index: number, array: any[]) => {
        const lastModal = index === array.length - 1
        switch (modal.name) {
          case 'basket':
            return <React.Fragment key={modal._id}>
              <Backdrop isOpen={lastModal}>
                <Basket onClose={onClose(modal._id)}/>
              </Backdrop>
            </React.Fragment>
          case 'adding':
            return <React.Fragment key={modal._id}>
              <Backdrop isOpen={lastModal}>
                <ModalAddBasket onClose={onClose(modal._id)} data={modal.data} t={t}/>
              </Backdrop>
            </React.Fragment>
          case 'modalList':
            return <React.Fragment key={modal._id}>
              <Backdrop isOpen={lastModal}>
                <ModalList onClose={onClose(modal._id)}/>
              </Backdrop>
            </React.Fragment>
          default:
            return <React.Fragment key={modal._id}></React.Fragment>
        }
      })}
    </>
  );
}

export default memo(ModalWindow);
