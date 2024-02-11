import React, {memo} from 'react';
import useTranslate from "@src/hooks/use-translate";
import useSelector from "@src/hooks/use-selector";
import Basket from "@src/app/basket";
import ModalAddBasket from "@src/components/modal-add-basket";
import ModalList from "@src/app/modal-list";
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import Backdrop from "@src/components/backdrop";

export type onCloseModal = (result: unknown, idModal?: string | number) => void

function ModalWindow() {
  const store = useStore()
  const {t}: any = useTranslate();

  const select = useSelector((state: any) => ({
    modalsList: state.modals.modalsList,
  }))

  // Эта функция создает функцию закрытия определенного модального окна, то есть с помощью замыкания при создании модального окна мы передаем туда id текущего модального окна, но так же можно будет закрыть другое модальное окно по id
  const onClose = (_id: number | string) => (result: any, idModal = _id): onCloseModal => store.actions.modals.close(result, idModal)
  useInit(() => {
    // Для одного из модальных окон необходимо создать определенный стор
    store.make('modal-catalog', 'catalog', {entryURLParams: false})
  }, [])

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
