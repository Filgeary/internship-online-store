import StoreModule from "../module";

class ModalsState extends StoreModule {

  initState() {
    return {
      name: null,
      list: [],
      resolve: null
    }
  }

  open(name){
    this.setState({...this.getState(), name}, `Открытие модалки ${name}`);
  }

  close(){
    this.setState({...this.getState(), name: null, resolve: null }, `Закрытие модалки`);
  }

  resolve(resolve) {
    this.setState({...this.getState(), resolve });
  }
}

export default ModalsState;
