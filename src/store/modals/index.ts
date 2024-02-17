import StoreModule from "../module";
import { ModalType, ModalsKeys, ModalsReturnType, ModalsStateType } from "./types";


/**
 * Список открытых модальных/диалоговых окнах в приложении
 */
class ModalsState extends StoreModule<ModalsStateType> {

  modals: {
    [key: string]: ModalType
  };

  initState(): ModalsStateType {
    return {
      modals: {}
    }
  }

  open<T extends ModalsKeys>(name: T, data?: any): Promise<ModalsReturnType[T]> {
    return new Promise((resolve, reject) => {
      const newModal: ModalType = {
        id: self.crypto.randomUUID(),
        name,
        initialData: data,
        close: (data: ModalsReturnType[T]) => resolve(data),
      }

      this.setState({
        ...this.getState(),
        modals: {...this.getState().modals, [newModal.id]: newModal}
      });
    })
  }

  close<T>(id: string, data?: T){
    let newModals = {...this.getState().modals}
    newModals[id].close(data);
    delete newModals[id];

    this.setState({
      ...this.getState(),
      modals: newModals,
    })
  }
}

export default ModalsState;
