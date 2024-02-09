import StoreModule from "../module";
import { ModalType, ModalsStateType } from "./types";

class ModalsState extends StoreModule {

  modals: ModalsStateType;

  initState(): ModalsStateType {
    return {
      modals: {}
    }
  }

  open<U = any, T = any>(name: string, data?: T): Promise<U> {
    return new Promise((resolve, reject) => {
      const newModal: ModalType = {
        id: self.crypto.randomUUID(),
        name,
        initialData: data,
        close: (data: U) => resolve(data),
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
