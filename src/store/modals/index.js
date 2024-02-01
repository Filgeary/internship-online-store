import StoreModule from "../module";

class ModalsState extends StoreModule {

  initState() {
    return {
      modals: {}
    }
  }

  open(name, data){
    return new Promise((resolve, reject) => {
      const newModal = {
        id: self.crypto.randomUUID(),
        name,
        initialData: data,
        close: (data) => resolve(data),
      }

      this.setState({
        ...this.getState(),
        modals: {...this.getState().modals, [newModal.id]: newModal}
      });
    })
  }

  close(id, data){
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
