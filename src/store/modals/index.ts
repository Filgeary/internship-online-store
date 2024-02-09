import StoreModule from "../module"

export interface ICategoriesInitState {
  name: string | null
}

class ModalsState extends StoreModule {

  initState() {
    return {
      name: null
    }
  }

  open(name: string){
    this.setState({name}, `Открытие модалки ${name}`);
  }

  close(){
    this.setState({name: null}, `Закрытие модалки`);
  }
}

export default ModalsState;
